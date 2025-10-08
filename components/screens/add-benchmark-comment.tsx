import { BenchmarkComment } from "@/types/benchmarkComment";
import {useState} from "react";
interface AddBenchmarkCommentProps {
    benchmarkComment: BenchmarkComment;
    onSubmit: (comment: BenchmarkComment) => void;
    onCancel: () => void;  

}

const AddBenchmarkComment: React.FC<AddBenchmarkCommentProps> = ({ benchmarkComment, onSubmit, onCancel }) => {
    const [benchmarkCommentState, setBenchmarkCommentState] = useState<BenchmarkComment>(benchmarkComment);
    const [comment, setComment] = useState<string>('');
    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(e.target.value);
        setBenchmarkCommentState({...benchmarkCommentState, userComment: e.target.value});
    }
    const getCategoryName = (categoryId: string): string => {
        switch (categoryId) {
            case "highly_relevant":
                return "Highly Relevant";
            case "relevant":
                return "Relevant";
            case "needs_more_info":
                return "Needs More Info";
            case "definitely_not_relevant":
                return "Definitely Not Relevant";
            default:
                return categoryId;
        }
    }
    return <div className="flex-grow min-h-0 overflow-y-auto pr-1 -mr-3">
        <div className="max-w-3xl mx-auto p-4">

            <h2 className="text-lg font-semibold text-text-primary mb-2">Add Comment</h2>
            <h3 className="text-sm text-text-secondary mb-4">You are changing the category from <span className="font-medium">{getCategoryName(benchmarkComment.oldCategory)}</span> to <span className="font-medium">{getCategoryName(benchmarkComment.newCategory)}</span></h3>
            <textarea
                className="w-full h-32 p-2 border border-custom-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background-secondary text-text-primary"
                placeholder="Enter your comment here..."
                value={comment}
                onChange={(e) => handleCommentChange(e)}
            />
            <button
                className="mt-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                onClick={() => onSubmit(benchmarkCommentState)}
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