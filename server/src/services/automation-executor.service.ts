import { Automation } from '../models/automation.model';
import { sendEmail } from '../utils/nodemailer';

interface ExecutionContext {
  email: string;
  variables: Record<string, unknown>;
}

export class AutomationExecutor {
  static async execute(automationId: string, targetEmail: string) {
    const automation = await Automation.findById(automationId);
    if (!automation) throw new Error('Automation not found');

    const context: ExecutionContext = {
      email: targetEmail,
      variables: { email: targetEmail },
    };
    // Find Start node
    const startNode = automation.nodes.find((n: any) => n.type === 'start');
    if (!startNode) return;

    // Start background execution
    this.processNode(startNode.id as string, automation.nodes, automation.edges, context);
  }

  private static async processNode(
    nodeId: string,
    nodes: any[],
    edges: any[],
    context: ExecutionContext,
  ) {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    let nextNodeId: string | null = null;
    let nextHandle: string | null = null;

    try {
      switch (node.type) {
        case 'start':
          nextNodeId = this.getNextNodeId(nodeId, edges);
          break;

        case 'action': {
          const message = node.data?.message || '';
          console.log(message);
          await sendEmail({
            to: context.email,
            subject: 'Automation Action',
            text: message,
          });
          nextNodeId = this.getNextNodeId(nodeId, edges);
          break;
        }

        case 'delay': {
          const delayType = node.data?.delayType;
          let delayMs = 0;

          if (delayType === 'relative') {
            const unit = node.data?.unit;
            const value = parseInt(node.data?.value) || 0;
            if (unit === 'minutes') delayMs = value * 60 * 1000;
            else if (unit === 'hours') delayMs = value * 60 * 60 * 1000;
            else if (unit === 'days') delayMs = value * 24 * 60 * 60 * 1000;
          } else if (delayType === 'specific') {
            const targetDate = new Date(node.data?.date);
            const now = new Date();
            delayMs = Math.max(0, targetDate.getTime() - now.getTime());
          }

          if (delayMs > 0) {
            await new Promise((resolve) => setTimeout(resolve, delayMs));
          }
          nextNodeId = this.getNextNodeId(nodeId, edges);
          break;
        }

        case 'condition': {
          const result = this.evaluateCondition(node.data?.rules, context);
          nextHandle = result ? 'true' : 'false';
          nextNodeId = this.getNextNodeId(nodeId, edges, nextHandle);
          break;
        }

        case 'end':
          return;
      }
    } catch (error) {
      console.error(`Error processing node ${nodeId}:`, error);
      return;
    }

    if (nextNodeId) {
      this.processNode(nextNodeId, nodes, edges, context);
    }
  }

  private static getNextNodeId(nodeId: string, edges: any[], handle?: string | null) {
    const edge = edges.find(
      (e) => e.source === nodeId && (handle ? e.sourceHandle === handle : true),
    );
    return edge ? (edge.target as string) : null;
  }

  private static evaluateCondition(rules: any[], context: ExecutionContext): boolean {
    if (!rules || rules.length === 0) return true;

    let overallResult = false;

    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      const fieldValue = context.email;
      let ruleResult = false;

      const value = rule.value;
      switch (rule.operator) {
        case 'equals':
          ruleResult = fieldValue === value;
          break;
        case 'not equals':
          ruleResult = fieldValue !== value;
          break;
        case 'includes':
          ruleResult = fieldValue.includes(value);
          break;
        case 'starts with':
          ruleResult = fieldValue.startsWith(value);
          break;
        case 'ends with':
          ruleResult = fieldValue.endsWith(value);
          break;
      }

      if (i === 0) {
        overallResult = ruleResult;
      } else {
        if (rule.joinType === 'AND') {
          overallResult = overallResult && ruleResult;
        } else {
          overallResult = overallResult || ruleResult;
        }
      }
    }

    return overallResult;
  }
}
