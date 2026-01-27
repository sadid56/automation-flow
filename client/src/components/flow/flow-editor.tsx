"use client";

import React, { useCallback, useMemo, useState } from "react";
import {
  ReactFlow,
  addEdge,
  Background,
  Controls,
  MiniMap,
  Edge,
  Node,
  applyNodeChanges,
  applyEdgeChanges,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { StartNode, EndNode, ActionNode, DelayNode, ConditionNode } from "./nodes";
import { NodeSidebar } from "./node-sidebar";
import { Button } from "@/components/ui/button";
import { Plus, Save } from "lucide-react";
import { Automation } from "@/types/automation.types";

const nodeTypes = {
  start: StartNode,
  end: EndNode,
  action: ActionNode,
  delay: DelayNode,
  condition: ConditionNode,
};

const initialNodes: Node[] = [
  {
    id: "start",
    type: "start",
    position: { x: 250, y: 50 },
    data: {},
    draggable: true,
  },
  {
    id: "end",
    type: "end",
    position: { x: 250, y: 450 },
    data: {},
    draggable: true,
  },
];

const initialEdges: Edge[] = [{ id: "e-start-end", source: "start", target: "end" }];

interface FlowEditorProps {
  initialData?: { nodes: Node[]; edges: Edge[] };
  onSave: (data: { nodes: Node[]; edges: Edge[] }) => void;
}

export function FlowEditor({ initialData, onSave }: FlowEditorProps) {
  const [nodes, setNodes] = useState<Node[]>(initialData?.nodes || initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialData?.edges || initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const onNodesChange: OnNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange: OnEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect: OnConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  const addNode = (type: string) => {
    const id = `${type}-${Date.now()}`;
    const newNode: Node = {
      id,
      type,
      position: { x: 250, y: 250 },
      data: {
        label: `${type} node`,
        message: "",
        delayType: "relative",
        value: "10",
        unit: "minutes",
        rules: [],
      },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const updateNodeData = (nodeId: string, newData: Automation) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...newData } };
        }
        return node;
      }),
    );
  };

  const selectedNode = useMemo(() => nodes.find((n) => n.id === selectedNodeId), [nodes, selectedNodeId]);

  return (
    <div className='flex w-full h-full bg-gray-50 overflow-hidden relative'>
      <div className='flex-1 h-full'>
        <div className='absolute top-4 left-4 z-10 flex gap-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-xl border shadow-sm'>
          <Button
            size='sm'
            variant='outline'
            onClick={() => addNode("action")}
            className='bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200'
          >
            <Plus className='w-4 h-4 mr-2' />
            Action
          </Button>
          <Button
            size='sm'
            variant='outline'
            onClick={() => addNode("delay")}
            className='bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-200'
          >
            <Plus className='w-4 h-4 mr-2' />
            Delay
          </Button>
          <Button
            size='sm'
            variant='outline'
            onClick={() => addNode("condition")}
            className='bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200'
          >
            <Plus className='w-4 h-4 mr-2' />
            Condition
          </Button>
          <div className='w-px bg-gray-200 mx-1 h-8 self-center' />
          <Button size='sm' onClick={() => onSave({ nodes, edges })} className='bg-green-600 hover:bg-green-700 text-white'>
            <Save className='w-4 h-4 mr-2' />
            Save Flow
          </Button>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>

      {selectedNode && (
        <NodeSidebar
          node={selectedNode}
          onUpdate={(data: Automation) => updateNodeData(selectedNode.id, data)}
          onDelete={() => {
            setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
            setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
            setSelectedNodeId(null);
          }}
        />
      )}
    </div>
  );
}
