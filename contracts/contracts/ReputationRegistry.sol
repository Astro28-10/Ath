// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ReputationRegistry {
    struct CredentialRecord {
        bytes32 credentialHash;
        address issuer;
        uint256 issuedAt;
        uint256 weight; // Credibility weight (0-10000, where 10000 = maximum weight)
    }

    mapping(address => bytes32[]) public freelancerCredentials;
    mapping(address => CredentialRecord[]) public freelancerCredentialDetails;

    event CredentialRegistered(
        address indexed freelancer,
        address indexed issuer,
        bytes32 credentialHash,
        uint256 weight
    );

    function registerCredential(
        address _freelancer,
        bytes32 _credentialHash,
        address _issuer,
        uint256 _weight
    ) external {
        require(_freelancer != address(0), "Invalid freelancer address");
        require(_weight <= 10000, "Weight cannot exceed 10000");
        require(_credentialHash != bytes32(0), "Invalid credential hash");

        freelancerCredentials[_freelancer].push(_credentialHash);
        freelancerCredentialDetails[_freelancer].push(
            CredentialRecord({
                credentialHash: _credentialHash,
                issuer: _issuer,
                issuedAt: block.timestamp,
                weight: _weight
            })
        );

        emit CredentialRegistered(_freelancer, _issuer, _credentialHash, _weight);
    }

    function getCredentialHashes(address _freelancer)
        external
        view
        returns (bytes32[] memory)
    {
        return freelancerCredentials[_freelancer];
    }

    function getCredentialCount(address _freelancer) external view returns (uint256) {
        return freelancerCredentials[_freelancer].length;
    }

    function getCredentialDetails(address _freelancer, uint256 _index)
        external
        view
        returns (
            bytes32 hash,
            address issuer,
            uint256 issuedAt,
            uint256 weight
        )
    {
        require(_index < freelancerCredentialDetails[_freelancer].length, "Index out of bounds");
        CredentialRecord storage record = freelancerCredentialDetails[_freelancer][_index];
        return (record.credentialHash, record.issuer, record.issuedAt, record.weight);
    }

    function calculateReputationScore(address _freelancer) external view returns (uint256) {
        CredentialRecord[] storage credentials = freelancerCredentialDetails[_freelancer];
        if (credentials.length == 0) {
            return 5000; // Default score of 50%
        }

        uint256 totalWeight = 0;
        uint256 weightedScore = 0;

        for (uint256 i = 0; i < credentials.length; i++) {
            uint256 weight = credentials[i].weight;
            totalWeight += weight;
            weightedScore += weight * 10000; // Assume each credential is worth 100% quality
        }

        if (totalWeight == 0) {
            return 5000;
        }

        return (weightedScore / credentials.length) / 100;
    }
}
