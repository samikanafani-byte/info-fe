import { getStreamTextTitle, getThoughtTitle, StreamState } from "@/types/streamState";
import { use, useEffect } from "react";

interface StreamTextComponentProps {
    streamState: StreamState;
}

const StreamTextComponent: React.FC<StreamTextComponentProps> = ({ streamState }: StreamTextComponentProps) => {

    useEffect(() => {
        console.log("StreamTextComponent rendered with streamState:", streamState);
    }, [streamState]);
    return (
        <div className="text-sm font-bold text-gray-700">
            {getStreamTextTitle(streamState)}
        </div>
    )
}
export default StreamTextComponent;