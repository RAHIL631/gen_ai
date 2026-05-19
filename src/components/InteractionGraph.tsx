import React, { useMemo } from 'react';
import { ReactFlow, Background, Controls, Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { AnalysisResult } from '../types';

interface InteractionGraphProps {
  result: AnalysisResult;
}

export function InteractionGraph({ result }: InteractionGraphProps) {
  const { nodes, edges } = useMemo(() => {
    if (!result || !result.interactions) return { nodes: [], edges: [] };

    const uniqueDrugs = Array.from(new Set(result.interactions.flatMap(i => i.drugs)));
    
    const nodes: Node[] = uniqueDrugs.map((drug, index) => ({
      id: drug,
      position: { 
        x: 250 + Math.cos((index / uniqueDrugs.length) * 2 * Math.PI) * 150, 
        y: 200 + Math.sin((index / uniqueDrugs.length) * 2 * Math.PI) * 150 
      },
      data: { label: drug.charAt(0).toUpperCase() + drug.slice(1) },
      style: {
        background: 'rgba(13, 148, 136, 0.1)',
        color: '#2dd4bf',
        border: '1px solid rgba(45, 212, 191, 0.3)',
        borderRadius: '12px',
        padding: '10px 20px',
        fontWeight: 'bold',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }
    }));

    const edges: Edge[] = result.interactions.map((interaction, idx) => {
      let strokeColor = '#94a3b8'; // default none
      const severityUpper = String(interaction.severity).toUpperCase();
      
      if (severityUpper === 'MAJOR' || severityUpper === 'CONTRAINDICATED') strokeColor = '#f43f5e';
      else if (severityUpper === 'MODERATE') strokeColor = '#3b82f6';
      else if (severityUpper === 'MINOR' || severityUpper === 'LOW') strokeColor = '#10b981';

      return {
        id: `e-${idx}`,
        source: interaction.drugs[0],
        target: interaction.drugs[1],
        animated: true,
        style: { stroke: strokeColor, strokeWidth: 2 },
      };
    });

    return { nodes, edges };
  }, [result]);

  return (
    <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-white/10 relative" style={{ background: 'rgba(0,0,0,0.2)' }}>
      <div className="absolute top-4 left-4 z-10">
        <h3 className="text-sm font-bold text-white mb-2">Interaction Network</h3>
        <div className="flex gap-3 text-[10px] font-medium">
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-500"></div> High Risk</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Moderate</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Minor</span>
        </div>
      </div>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background color="#ffffff" gap={16} size={1} opacity={0.05} />
        <Controls showInteractive={false} className="!bg-black/50 !border-white/10 !fill-white" />
      </ReactFlow>
    </div>
  );
}
