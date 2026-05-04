/**
 * ARBC (Attribute Role-Based Control) Evaluator
 *
 * Demonstrates:
 * 1. Hybrid Role + Attribute evaluation.
 * 2. Centralized Authority Service.
 * 3. Policy-based access decisions.
 */

// 1. SCHEMAS
interface User {
  id: string;
  roles: string[];
  attributes: {
    department: string;
    clearanceLevel: number;
  };
}

interface Resource {
  type: string;
  ownerId: string;
  attributes: {
    isPublic: boolean;
    sensitivity: number;
    department?: string;
  };
}

interface Environment {
  ip: string;
  isCorporateNetwork: boolean;
  timestamp: Date;
}

// 2. THE ARBC EVALUATOR
export class AuthorityService {
  /**
   * Evaluates if a subject can perform an action on a resource
   * within a given environment context.
   */
  public evaluate(params: {
    action: string;
    subject: User;
    resource: Resource;
    context: Environment;
  }): boolean {
    const { action, subject, resource, context } = params;

    // RULE 1: Admin bypass (Role dominance)
    if (subject.roles.includes('ADMIN')) return true;

    // RULE 2: Ownership attribute (Direct relationship)
    if (subject.id === resource.ownerId) return true;

    // RULE 3: Public resource (Resource attribute)
    if (resource.attributes.isPublic && action === 'read') return true;

    // RULE 4: Dynamic Policy Evaluation (Complexity)
    return this.evaluatePolicies(action, subject, resource, context);
  }

  private evaluatePolicies(
    action: string,
    subject: User,
    resource: Resource,
    context: Environment,
  ): boolean {
    // POLICY: Department Lock
    // "Users can only access resources within their own department"
    if (
      resource.attributes.department &&
      resource.attributes.department !== subject.attributes.department
    ) {
      return false;
    }

    // POLICY: Sensitivity vs Clearance (Level-based ARBC)
    // "User clearance must meet or exceed resource sensitivity"
    if (resource.attributes.sensitivity > subject.attributes.clearanceLevel) {
      return false;
    }

    // POLICY: Environment context
    // "High-sensitivity resources require corporate network access"
    if (resource.attributes.sensitivity > 5 && !context.isCorporateNetwork) {
      return false;
    }

    return true;
  }
}

// 3. USAGE IN A USE CASE
async function handleUpdateDocument(userId: string, documentId: string) {
  const user = await userRepository.findById(userId);
  const resource = await documentRepository.findById(documentId);
  const context = {
    ip: '...',
    isCorporateNetwork: true,
    timestamp: new Date(),
  };

  const auth = new AuthorityService();

  const isAllowed = auth.evaluate({
    action: 'document.update',
    subject: user,
    resource,
    context,
  });

  if (!isAllowed) {
    throw new ForbiddenError('ARBC policy denied access to this resource.');
  }

  // Proceed with update...
}
