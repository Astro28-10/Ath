/**
 * Escrow Calculator Engine
 * Handles all escrow cost calculations based on reputation scores
 * 
 * Formula: Final Cost = Base Amount * (1 - (reputationScore / 10000))
 * Example: $1000 with 85% reputation = $1000 * (1 - 0.15) = $850
 */

/**
 * Calculate escrow cost and breakdown
 * @param {number} baseAmount - Original project amount in wei
 * @param {number} clientReputation - Client reputation score (0-10000)
 * @param {number} freelancerReputation - Freelancer reputation score (0-10000)
 * @returns {object} Detailed escrow calculation breakdown
 */
function calculateEscrow(baseAmount, clientReputation = 0, freelancerReputation = 0) {
  // Ensure valid inputs
  const base = Math.max(0, Number(baseAmount) || 0);
  const clientRep = Math.max(0, Math.min(10000, Number(clientReputation) || 0));
  const freelancerRep = Math.max(0, Math.min(10000, Number(freelancerReputation) || 0));

  // Calculate discount percentages (in basis points)
  const clientDiscount = Math.round(clientRep * 0.3); // Client rep accounts for 30% of discount
  const freelancerDiscount = Math.round(freelancerRep * 0.7); // Freelancer rep accounts for 70%
  const totalDiscount = Math.min(clientDiscount + freelancerDiscount, 9500); // Cap at 95%

  // Calculate amounts
  const discountPercentage = totalDiscount / 10000;
  const escrowCost = Math.round(base * discountPercentage);
  const finalAmount = base - escrowCost;
  const savingsPercentage = (discountPercentage * 100).toFixed(2);

  return {
    baseAmount: base,
    escrowCost,
    finalAmount,
    breakdown: {
      clientReputationFactor: clientRep / 10000,
      freelancerReputationFactor: freelancerRep / 10000,
      clientDiscount,
      freelancerDiscount,
      totalDiscount,
    },
    percentages: {
      escrowCostPercent: savingsPercentage,
      discountApplied: (totalDiscount / 10000 * 100).toFixed(2),
      clientRepPercent: (clientRep / 10000 * 100).toFixed(1),
      freelancerRepPercent: (freelancerRep / 10000 * 100).toFixed(1),
    },
  };
}

/**
 * Calculate reputation impact when project completes
 * @param {object} project - Project data
 * @param {string} outcome - 'completed' | 'disputed_favorable' | 'disputed_unfavorable' | 'refunded'
 * @returns {object} New reputation scores for both parties
 */
function calculateReputationImpact(project, outcome = 'completed') {
  const { clientReputation, freelancerReputation, amount } = project;

  let clientImpact = 0;
  let freelancerImpact = 0;
  let reason = '';

  const baseImpact = Math.min(500, Math.floor(amount / 1e18 * 100)); // Scale impact by project size

  switch (outcome) {
    case 'completed':
      // Successful completion boosts both
      clientImpact = Math.round(baseImpact * 1.5); // Client gets good feedback
      freelancerImpact = Math.round(baseImpact * 2); // Freelancer gets bigger boost
      reason = 'Project completed successfully';
      break;

    case 'disputed_favorable':
      // Dispute resolved in freelancer's favor
      clientImpact = -Math.round(baseImpact * 0.5); // Minor hit for client
      freelancerImpact = Math.round(baseImpact * 2.5); // Significant boost for freelancer
      reason = 'Dispute resolved in freelancer favor';
      break;

    case 'disputed_unfavorable':
      // Dispute resolved against freelancer
      clientImpact = Math.round(baseImpact * 1.2);
      freelancerImpact = -Math.round(baseImpact * 3); // Significant hit
      reason = 'Dispute resolved against freelancer';
      break;

    case 'refunded':
      // Refund (client initiated cancellation or dispute loss)
      clientImpact = -Math.round(baseImpact * 1.5);
      freelancerImpact = 0;
      reason = 'Project refunded - no delivery';
      break;

    default:
      reason = 'Unknown outcome';
  }

  const newClientRep = Math.max(0, Math.min(10000, clientReputation + clientImpact));
  const newFreelancerRep = Math.max(0, Math.min(10000, freelancerReputation + freelancerImpact));

  return {
    outcome,
    reason,
    changes: {
      clientRepChange: clientImpact,
      freelancerRepChange: freelancerImpact,
    },
    before: {
      clientReputation,
      freelancerReputation,
    },
    after: {
      clientReputation: newClientRep,
      freelancerReputation: newFreelancerRep,
    },
    percentageChange: {
      clientChangePercent: ((clientImpact / 10000) * 100).toFixed(2),
      freelancerChangePercent: ((freelancerImpact / 10000) * 100).toFixed(2),
    },
  };
}

/**
 * Generate visual timeline of escrow process
 * @param {number} durationDays - Project duration
 * @returns {array} Timeline events
 */
function generateTimeline(durationDays = 7) {
  const events = [
    {
      stage: 1,
      name: 'Work Order Created',
      description: 'Client creates project and specifies requirements',
      daysFromStart: 0,
      color: 'blue',
      icon: '📋',
    },
    {
      stage: 2,
      name: 'Funds Locked in Escrow',
      description: 'Client funds project, amount held securely',
      daysFromStart: 0,
      color: 'yellow',
      icon: '🔒',
    },
    {
      stage: 3,
      name: 'Work in Progress',
      description: 'Freelancer works on deliverables',
      daysFromStart: Math.ceil(durationDays * 0.3),
      color: 'purple',
      icon: '⚙️',
    },
    {
      stage: 4,
      name: 'Work Delivered',
      description: 'Freelancer submits deliverables for review',
      daysFromStart: durationDays,
      color: 'green',
      icon: '✅',
    },
    {
      stage: 5,
      name: 'Client Reviews',
      description: 'Client has 2 days to review and approve/dispute',
      daysFromStart: durationDays,
      color: 'orange',
      icon: '👀',
    },
    {
      stage: 6,
      name: 'Funds Released',
      description: 'Funds transferred to freelancer account',
      daysFromStart: durationDays + 2,
      color: 'green',
      icon: '💰',
    },
    {
      stage: 7,
      name: 'Credential Minted',
      description: 'W3C verifiable credential issued & reputation updated',
      daysFromStart: durationDays + 2,
      color: 'green',
      icon: '🏆',
    },
  ];

  return events;
}

/**
 * Calculate rating impact on freelancer's average rating
 * @param {number} currentAvgRating - Current average rating (1-5)
 * @param {number} projectRating - Rating for this project (1-5)
 * @param {number} totalProjects - Total completed projects
 * @returns {object} New average rating and weighted impact
 */
function calculateRatingImpact(currentAvgRating = 4.0, projectRating = 5, totalProjects = 1) {
  const current = Math.max(1, Math.min(5, Number(currentAvgRating) || 4.0));
  const rating = Math.max(1, Math.min(5, Number(projectRating) || 5));
  const total = Math.max(1, Number(totalProjects) || 1);

  const newAverage = ((current * total) + rating) / (total + 1);
  const ratingChange = newAverage - current;

  return {
    before: {
      avgRating: current.toFixed(2),
      totalProjects,
    },
    after: {
      avgRating: newAverage.toFixed(2),
      totalProjects: total + 1,
    },
    change: {
      difference: ratingChange.toFixed(3),
      percentChange: ((ratingChange / current) * 100).toFixed(2),
    },
    impact: ratingChange > 0 ? '⬆️ Positive' : ratingChange < 0 ? '⬇️ Negative' : '→ No change',
  };
}

/**
 * Simulate complete project workflow
 * @param {object} input - Simulation input data
 * @returns {object} Complete workflow simulation result
 */
function simulateWorkflow(input) {
  const {
    clientAddress,
    clientReputation = 5000,
    freelancerAddress,
    freelancerReputation = 6000,
    projectAmount,
    durationDays = 7,
    outcome = 'completed',
    clientRating = 5,
  } = input;

  // Step 1: Calculate escrow
  const escrowCalc = calculateEscrow(projectAmount, clientReputation, freelancerReputation);

  // Step 2: Generate timeline
  const timeline = generateTimeline(durationDays);

  // Step 3: Calculate reputation impact
  const reputationImpact = calculateReputationImpact(
    {
      clientReputation,
      freelancerReputation,
      amount: projectAmount,
    },
    outcome
  );

  // Step 4: Calculate rating impact
  const ratingImpact = calculateRatingImpact(4.0, clientRating, 0);

  // Step 5: Generate certificate data
  const certificateData = generateCertificateData({
    freelancerAddress,
    clientAddress,
    projectAmount,
    outcome,
    reputationBefore: freelancerReputation,
    reputationAfter: reputationImpact.after.freelancerReputation,
  });

  return {
    success: true,
    simulationId: `sim-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    input: {
      clientAddress,
      freelancerAddress,
      projectAmount,
      durationDays,
      outcome,
    },
    escrow: escrowCalc,
    timeline,
    reputationImpact,
    ratingImpact,
    certificate: certificateData,
    summary: {
      totalCost: escrowCalc.baseAmount,
      escrowCost: escrowCalc.escrowCost,
      freelancerEarns: escrowCalc.finalAmount,
      timelineLength: `${durationDays} days + 2 days review`,
    },
  };
}

/**
 * Generate certificate data for offline creation
 * @param {object} data - Certificate data
 * @returns {object} Certificate credential data
 */
function generateCertificateData(data) {
  const {
    freelancerAddress,
    clientAddress,
    projectAmount,
    outcome,
    reputationBefore,
    reputationAfter,
  } = data;

  const certificateId = `cert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const hash = `0x${Math.random().toString(16).substr(2)}${Math.random().toString(16).substr(2)}`;

  return {
    certificateId,
    hash,
    type: 'ProjectCompletionCredential',
    issuer: {
      name: 'SkillBond',
      address: clientAddress,
      did: `did:ethr:${clientAddress}`,
    },
    subject: {
      address: freelancerAddress,
      did: `did:ethr:${freelancerAddress}`,
    },
    issuanceDate: new Date().toISOString(),
    claim: {
      outcome,
      projectValue: projectAmount,
      reputationChange: {
        before: reputationBefore,
        after: reputationAfter,
        changeAmount: reputationAfter - reputationBefore,
      },
    },
    proof: {
      type: 'EcdsaSecp256k1Signature2019',
      created: new Date().toISOString(),
      verificationMethod: `did:ethr:${clientAddress}#controller`,
      proofPurpose: 'assertionMethod',
      jws: `mock-sig-${Math.random().toString(36).substr(2, 9)}`,
    },
  };
}

module.exports = {
  calculateEscrow,
  calculateReputationImpact,
  generateTimeline,
  calculateRatingImpact,
  simulateWorkflow,
  generateCertificateData,
};
