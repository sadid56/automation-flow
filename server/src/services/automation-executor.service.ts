import { Automation } from '../models/automation.model.js';
import { sendEmail } from '../utils/nodemailer.js';

interface ExecutionContext {
  email: string;
  variables: Record<string, unknown>;
}

export class AutomationExecutor {
  static async execute(automationId: string, targetEmail: string) {
    console.log(
      `[AutomationExecutor] Starting execution for ID: ${automationId}, Email: ${targetEmail}`,
    );
    const automation = await Automation.findById(automationId);
    if (!automation) {
      console.error(`[AutomationExecutor] Automation with ID ${automationId} not found`);
      throw new Error('Automation not found');
    }

    const context: ExecutionContext = {
      email: targetEmail,
      variables: { email: targetEmail },
    };
    console.log(`[AutomationExecutor] Nodes count: ${automation.nodes.length}`);
    console.log(`[AutomationExecutor] Edges count: ${automation.edges.length}`);
    // Find Start node
    const startNode = automation.nodes.find((n: any) => n.type === 'start');
    if (!startNode) {
      console.warn(`[AutomationExecutor] No start node found for automation ${automationId}`);
      console.log(`[AutomationExecutor] Processing all action nodes directly...`);

      // Process all action nodes directly without requiring a start node
      const actionNodes = automation.nodes.filter((n: any) => n.type === 'action');
      console.log(`[AutomationExecutor] Found ${actionNodes.length} action node(s) to process`);

      for (const actionNode of actionNodes) {
        await this.processNode(
          actionNode.id as string,
          automation.nodes,
          automation.edges,
          context,
        );
      }
      return;
    }

    console.log(`[AutomationExecutor] Found start node ${startNode.id}. Beginning processing...`);
    // Start background execution
    await this.processNode(startNode.id as string, automation.nodes, automation.edges, context);
  }

  private static async processNode(
    nodeId: string,
    nodes: any[],
    edges: any[],
    context: ExecutionContext,
  ) {
    console.log(`[AutomationExecutor] Processing node: ${nodeId}`);
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) {
      console.error(`[AutomationExecutor] Node ${nodeId} not found in automation nodes`);
      return;
    }

    console.log(`[AutomationExecutor] Node type: ${node.type}`);

    let nextNodeId: string | null = null;
    let nextHandle: string | null = null;

    try {
      switch (node.type) {
        case 'start':
          nextNodeId = this.getNextNodeId(nodeId, edges);
          break;

        case 'action': {
          const message = node.data?.message || '';
          console.log(`[AutomationExecutor] Sending email to ${context.email}...`);
          console.log(
            `[AutomationExecutor] Email content: ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}`,
          );
          await sendEmail({
            to: context.email,
            subject: 'Automation Action',
            text: message,
          });
          console.log(`[AutomationExecutor] ✓ Email sent successfully to ${context.email}`);
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
            console.log(
              `[AutomationExecutor] Delaying for ${delayMs}ms (${node.data?.value} ${node.data?.unit || 'ms'})`,
            );
            await new Promise((resolve) => setTimeout(resolve, delayMs));
            console.log(`[AutomationExecutor] Delay completed, continuing execution`);
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
      await this.processNode(nextNodeId, nodes, edges, context);
    }
  }

  private static getNextNodeId(nodeId: string, edges: any[], handle?: string | null) {
    const validEdges = edges.filter(
      (e) => e.source === nodeId && (handle ? e.sourceHandle === handle : true),
    );

    if (validEdges.length === 0) return null;

    const nonEndEdge = validEdges.find((e) => e.target !== 'end');

    if (!nonEndEdge && validEdges.length > 0 && validEdges[0].target === 'end') {
      console.warn(
        `[AutomationExecutor] WARNING: Node '${nodeId}' is ONLY connected to 'End'. Your automation logic will be skipped. Please connect '${nodeId}' to an Action or Condition node.`,
      );
    }

    return nonEndEdge ? (nonEndEdge.target as string) : (validEdges[0].target as string);
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
