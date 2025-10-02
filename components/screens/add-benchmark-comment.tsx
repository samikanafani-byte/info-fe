import { BenchmarkComment } from "@/types/benchmarkComment";
import {useState} from "react";
interface AddBenchmarkCommentProps {
    benchmarkComment: BenchmarkComment;
    onSubmit: (comment: BenchmarkComment) => void;
    onCancel: () => void;  

}
const AddBenchmarkComment: React.FC<AddBenchmarkCommentProps> = ({ benchmarkComment, onSubmit, onCancel }) => {
    const [comment, setComment] = useState<string>('');
    return <div className="flex-grow min-h-0 overflow-y-auto pr-1 -mr-3">
        <div className="max-w-3xl mx-auto p-4">
            <h2 className="text-lg font-semibold text-text-primary mb-2">Add Comment</h2>
            <textarea
                className="w-full h-32 p-2 border border-custom-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background-secondary text-text-primary"
                placeholder="Enter your comment here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
            <button
                className="mt-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                onClick={() => onSubmit(benchmarkComment)}
            >
                Add Comment
            </button>
            <button
                className="mt-2 ml-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400 transition-colors"
                onClick={() => onCancel && onCancel()}
            >
                Cancel
            </button>

        </div>
    </div>
}
export default AddBenchmarkComment;