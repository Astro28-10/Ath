// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract EscrowContract {
    enum ProjectState {
        Created,
        Funded,
        Delivered,
        Completed,
        Disputed,
        Refunded
    }

    struct Project {
        address freelancer;
        address client;
        uint256 amount;
        uint256 reputationDiscount; // Basis points (e.g., 2000 = 20% discount)
        ProjectState state;
        uint256 createdAt;
        uint256 deadline;
        bytes32 deliverableHash;
    }

    mapping(uint256 => Project) public projects;
    uint256 public projectCounter;

    event ProjectCreated(
        uint256 indexed projectId,
        address indexed client,
        address indexed freelancer,
        uint256 amount,
        uint256 deadline
    );
    event ProjectFunded(uint256 indexed projectId);
    event DeliverableSubmitted(uint256 indexed projectId, bytes32 hash);
    event ProjectCompleted(uint256 indexed projectId);
    event DisputeInitiated(uint256 indexed projectId, string reason);
    event DisputeResolved(uint256 indexed projectId, bool favorFreelancer);
    event CredentialMinted(uint256 indexed projectId, address indexed freelancer);

    function createProject(
        address _freelancer,
        uint256 _amount,
        uint256 _reputationDiscount,
        uint256 _durationDays,
        bytes32 _deliverableHash
    ) external returns (uint256) {
        require(_freelancer != address(0), "Invalid freelancer address");
        require(_amount > 0, "Amount must be greater than 0");
        require(_durationDays > 0, "Duration must be at least 1 day");

        uint256 projectId = projectCounter++;
        projects[projectId] = Project({
            freelancer: _freelancer,
            client: msg.sender,
            amount: _amount,
            reputationDiscount: _reputationDiscount,
            state: ProjectState.Created,
            createdAt: block.timestamp,
            deadline: block.timestamp + (_durationDays * 1 days),
            deliverableHash: _deliverableHash
        });

        emit ProjectCreated(projectId, msg.sender, _freelancer, _amount, projects[projectId].deadline);
        return projectId;
    }

    function fundProject(uint256 _projectId) external payable {
        require(_projectId < projectCounter, "Project does not exist");
        Project storage project = projects[_projectId];
        require(project.state == ProjectState.Created, "Project is not in Created state");
        require(msg.sender == project.client, "Only client can fund");

        uint256 discountedAmount = (project.amount * (10000 - project.reputationDiscount)) / 10000;
        require(msg.value >= discountedAmount, "Insufficient funds");

        project.state = ProjectState.Funded;
        emit ProjectFunded(_projectId);
    }

    function submitDeliverable(uint256 _projectId, bytes32 _newHash) external {
        require(_projectId < projectCounter, "Project does not exist");
        Project storage project = projects[_projectId];
        require(project.state == ProjectState.Funded, "Project is not funded");
        require(msg.sender == project.freelancer, "Only freelancer can submit");

        project.deliverableHash = _newHash;
        project.state = ProjectState.Delivered;
        emit DeliverableSubmitted(_projectId, _newHash);
    }

    function approveCompletion(uint256 _projectId) external {
        require(_projectId < projectCounter, "Project does not exist");
        Project storage project = projects[_projectId];
        require(project.state == ProjectState.Delivered, "Project not delivered");
        require(msg.sender == project.client, "Only client can approve");

        uint256 releaseAmount = (project.amount * (10000 - project.reputationDiscount)) / 10000;
        project.state = ProjectState.Completed;

        // Release funds to freelancer
        (bool success, ) = project.freelancer.call{value: releaseAmount}("");
        require(success, "Payment failed");

        emit ProjectCompleted(_projectId);
        emit CredentialMinted(_projectId, project.freelancer);
    }

    function initiateDispute(uint256 _projectId, string calldata _reason) external {
        require(_projectId < projectCounter, "Project does not exist");
        Project storage project = projects[_projectId];
        require(
            project.state == ProjectState.Funded || project.state == ProjectState.Delivered,
            "Cannot dispute at this state"
        );
        require(msg.sender == project.client || msg.sender == project.freelancer, "Not authorized");

        project.state = ProjectState.Disputed;
        emit DisputeInitiated(_projectId, _reason);
    }

    function resolveDispute(uint256 _projectId, bool _favorFreelancer) external {
        require(_projectId < projectCounter, "Project does not exist");
        Project storage project = projects[_projectId];
        require(project.state == ProjectState.Disputed, "Project not in dispute");

        if (_favorFreelancer) {
            uint256 releaseAmount = (project.amount * (10000 - project.reputationDiscount)) / 10000;
            project.state = ProjectState.Completed;
            (bool success, ) = project.freelancer.call{value: releaseAmount}("");
            require(success, "Payment failed");
            emit CredentialMinted(_projectId, project.freelancer);
        } else {
            project.state = ProjectState.Refunded;
            uint256 refundAmount = (project.amount * (10000 - project.reputationDiscount)) / 10000;
            (bool success, ) = project.client.call{value: refundAmount}("");
            require(success, "Refund failed");
        }

        emit DisputeResolved(_projectId, _favorFreelancer);
    }

    function getProject(uint256 _projectId)
        external
        view
        returns (
            address freelancer,
            address client,
            uint256 amount,
            uint256 reputationDiscount,
            ProjectState state,
            uint256 createdAt,
            uint256 deadline,
            bytes32 deliverableHash
        )
    {
        require(_projectId < projectCounter, "Project does not exist");
        Project storage project = projects[_projectId];
        return (
            project.freelancer,
            project.client,
            project.amount,
            project.reputationDiscount,
            project.state,
            project.createdAt,
            project.deadline,
            project.deliverableHash
        );
    }

    function getProjectCount() external view returns (uint256) {
        return projectCounter;
    }
}
