import { Handle, Position } from "@xyflow/react";
import { Mail, Clock, Play, Square, Split } from "lucide-react";

export const StartNode = () => (
  <div className='px-4 py-2 shadow-lg rounded-xl bg-white border-2 border-green-500/20 flex flex-col items-center min-w-[120px]'>
    <div className='flex items-center gap-3'>
      <div className='rounded-full w-10 h-10 flex items-center justify-center bg-green-50'>
        <Play className='w-5 h-5 text-green-600 fill-green-600' />
      </div>
      <div>
        <div className='font-bold text-gray-900'>Start</div>
        <div className='text-[10px] text-green-600 font-bold uppercase'>Trigger</div>
      </div>
    </div>
    <Handle type='source' position={Position.Bottom} className='w-3 h-3 bg-green-500 border-2 border-white' />
  </div>
);

export const EndNode = () => (
  <div className='px-4 py-2 shadow-lg rounded-xl bg-white border-2 border-red-500/20 flex flex-col items-center min-w-[120px]'>
    <Handle type='target' position={Position.Top} className='w-3 h-3 bg-red-500 border-2 border-white' />
    <div className='flex items-center gap-3'>
      <div className='rounded-full w-10 h-10 flex items-center justify-center bg-red-50'>
        <Square className='w-5 h-5 text-red-600 fill-red-600' />
      </div>
      <div>
        <div className='font-bold text-gray-900'>End</div>
        <div className='text-[10px] text-red-600 font-bold uppercase'>Terminal</div>
      </div>
    </div>
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ActionNode = ({ data }: { data: any }) => (
  <div className='px-5 py-3 shadow-xl rounded-xl bg-white border-2 border-blue-500/20 min-w-[200px]'>
    <Handle type='target' position={Position.Top} className='w-3 h-3 bg-blue-500 border-2 border-white' />
    <div className='flex items-center gap-4'>
      <div className='rounded-xl w-12 h-12 flex items-center justify-center bg-blue-50'>
        <Mail className='w-6 h-6 text-blue-600' />
      </div>
      <div className='flex-1 overflow-hidden'>
        <div className='font-bold text-gray-900'>Send Email</div>
        <div className='text-xs text-slate-500 truncate italic'>{data.message || "Compose message..."}</div>
      </div>
    </div>
    <Handle type='source' position={Position.Bottom} className='w-3 h-3 bg-blue-500 border-2 border-white' />
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DelayNode = ({ data }: { data: any }) => (
  <div className='px-5 py-3 shadow-xl rounded-xl bg-white border-2 border-orange-500/20 min-w-[200px]'>
    <Handle type='target' position={Position.Top} className='w-3 h-3 bg-orange-500 border-2 border-white' />
    <div className='flex items-center gap-4'>
      <div className='rounded-xl w-12 h-12 flex items-center justify-center bg-orange-50'>
        <Clock className='w-6 h-6 text-orange-600' />
      </div>
      <div>
        <div className='font-bold text-gray-900'>Delay</div>
        <div className='text-xs font-medium text-orange-600 px-2 py-0.5 bg-orange-50 rounded-full inline-block mt-1'>
          {data.delayType === "relative"
            ? `${data.value || 0} ${data.unit || "mins"}`
            : data.date
              ? `${new Date(data.date).toLocaleDateString()}`
              : "Set delay"}
        </div>
      </div>
    </div>
    <Handle type='source' position={Position.Bottom} className='w-3 h-3 bg-orange-500 border-2 border-white' />
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ConditionNode = ({ data }: { data: any }) => (
  <div className='px-5 py-4 shadow-2xl rounded-2xl bg-white border-2 border-purple-500/20 min-w-[220px]'>
    <Handle type='target' position={Position.Top} className='w-3 h-3 bg-purple-500 border-2 border-white' />
    <div className='flex items-center gap-4 mb-3'>
      <div className='rounded-xl w-12 h-12 flex items-center justify-center bg-purple-50'>
        <Split className='w-6 h-6 text-purple-600' />
      </div>
      <div>
        <div className='font-bold text-gray-900'>Condition</div>
        <div className='text-[10px] font-bold text-purple-600 uppercase tracking-widest'>Gate</div>
      </div>
    </div>

    <div className='flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100'>
      <span className='font-bold text-purple-700'>{data.rules?.length || 0}</span>
      <span>Logic Rules Defined</span>
    </div>

    <div className='flex justify-between mt-4 px-1'>
      <div className='flex flex-col items-center gap-1'>
        <span className='text-[9px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded'>TRUE</span>
      </div>
      <div className='flex flex-col items-center gap-1'>
        <span className='text-[9px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded'>FALSE</span>
      </div>
    </div>

    <Handle
      type='source'
      position={Position.Bottom}
      id='true'
      style={{ left: "25%" }}
      className='w-3 h-3 bg-green-500 border-2 border-white'
    />
    <Handle
      type='source'
      position={Position.Bottom}
      id='false'
      style={{ left: "75%" }}
      className='w-3 h-3 bg-red-500 border-2 border-white'
    />
  </div>
);
