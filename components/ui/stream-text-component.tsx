import { getStreamTextTitle, getThoughtTitle, StreamState } from "@/types/streamState";

interface StreamTextComponentProps {
    streamState: StreamState;
}

const StreamTextComponent: React.FC<StreamTextComponentProps> = ({ streamState }: StreamTextComponentProps) => {

    const getStatusText = (): string =>{
        
        return ""
    }
    return (
        <div className="text-sm font-bold text-gray-700">
            {getStreamTextTitle(streamState)}
        </div>
    )
}
export default StreamTextComponent;