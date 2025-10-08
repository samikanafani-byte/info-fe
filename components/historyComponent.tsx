
import { BenchMarkState } from "@/types/benchMarkState";
import { JobTitleBenchmark } from "@/types/benchMarkTitles";
import { RankedExpert, UserComment } from "@/types/rankedExpert"; // Assuming this is where UserComment is defined
import React from 'react';
import { Button } from "./ui/button";


interface HistoryComponentProps {
    benchMarkState: BenchMarkState;
    historyType: 'profile' | 'title';
    onGoBack?: () => void;
    // New prop: Callback to handle saving the updated state
    onSave?: (newState: BenchMarkState) => void;
}

// Interface for a unified comment structure for sorting and display
interface DisplayComment extends UserComment {
    itemIdentifier: string;
    itemTitle: string;
    itemIndex: number; // Index of the item (JobTitle or Expert) in the results array
    commentIndex: number; // Index of the comment within the item's user_comments array
}

const HistoryComponent: React.FC<HistoryComponentProps> = ({ benchMarkState, historyType, onGoBack, onSave }) => {
    // Initialize internal state with the prop value
    const [benchMarkStateInternal, setBenchMarkStateInternal] = React.useState<BenchMarkState>(benchMarkState);

    // Update internal state if the prop changes
    React.useEffect(() => {
        setBenchMarkStateInternal(benchMarkState);
    }, [benchMarkState]);

    const allComments: DisplayComment[] = React.useMemo(() => {
        const comments: DisplayComment[] = [];

        if (historyType === 'title' && benchMarkStateInternal.benchmark_titles?.results) {
            benchMarkStateInternal.benchmark_titles.results.forEach((title, itemIndex) => {
                const itemTitle = `${title.company_job_function.job_function} @ ${title.company_job_function.company_name}`;
                title.user_comments?.forEach((uc, commentIndex) => {
                    comments.push({
                        ...uc,
                        itemIdentifier: title.benchmark_title_id,
                        itemTitle: itemTitle,
                        itemIndex: itemIndex,
                        commentIndex: commentIndex,
                    });
                });
            });
        } else if (historyType === 'profile' && benchMarkStateInternal.expert_rank_list?.results) {
            benchMarkStateInternal.expert_rank_list.results.forEach((expert, itemIndex) => {
                const expertName = expert.latest_job_function && expert.latest_company_name
                    ? `${expert.latest_job_function} @ ${expert.latest_company_name}`
                    : `Expert ID: ${expert.expert_id}`;
                expert.user_comments?.forEach((uc, commentIndex) => {
                    comments.push({
                        ...uc,
                        itemIdentifier: String(expert.expert_id),
                        itemTitle: expertName,
                        itemIndex: itemIndex,
                        commentIndex: commentIndex,
                    });
                });
            });
        }

        // Sort comments by timestamp in descending order
        return comments.sort((a, b) => b.timestamp - a.timestamp);
    }, [benchMarkStateInternal, historyType]);

    // Helper function to format the timestamp
    const formatTimestamp = (timestamp: number) => {
        // Corrected logic: timestamp is typically milliseconds OR seconds.
        // If it's a small number, assume seconds and convert to milliseconds.
        let ts = timestamp;
        if (ts < 10000000000) { // If timestamp is less than 10 billion (i.e., less than ~Apr 2286), assume seconds
            ts *= 1000;
        }

        return new Date(ts).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    // --- Deletion Handler ---
    const handleDeleteComment = (commentToDelete: DisplayComment) => {
        setBenchMarkStateInternal(prevState => {
            const newState = JSON.parse(JSON.stringify(prevState)) as BenchMarkState;

            if (historyType === 'title' && newState.benchmark_titles?.results) {
                const title = newState.benchmark_titles.results[commentToDelete.itemIndex] as JobTitleBenchmark | undefined;
                if (title && title.user_comments) {
                    // Remove the comment at the stored index
                    title.user_comments.splice(commentToDelete.commentIndex, 1);
                }
            } else if (historyType === 'profile' && newState.expert_rank_list?.results) {
                const expert = newState.expert_rank_list.results[commentToDelete.itemIndex] as RankedExpert | undefined;
                if (expert && expert.user_comments) {
                    // Remove the comment at the stored index
                    expert.user_comments.splice(commentToDelete.commentIndex, 1);
                }
            }

            return newState;
        });
    };

    
    const handleSave = () => {
        if (onSave) {
            onSave(benchMarkStateInternal);
        }
    };

    
    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <Button
                    onClick={onGoBack}
                    disabled={!onGoBack}
                    size={"sm"}
                >
                    &larr; Go Back
                </Button>
                <h2 style={{ margin: 0, textTransform: 'capitalize' }}>
                    {historyType} Comment History
                </h2>
                <Button
                    onClick={handleSave}
                    disabled={!onSave}
                    size={"sm"}
                >
                    Save Changes
                </Button>
            </div>

            {allComments.length === 0 ? (
                <p>No user comments found for the current {historyType} history.</p>
            ) : (
                <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                    {allComments.filter((comment) => comment.user_comment).map((comment, index) => (
                        <div
                            key={`${comment.itemIdentifier}-${comment.timestamp}-${index}`}
                            style={{
                                borderBottom: '1px dashed #eee',
                                padding: '15px 0',
                                marginBottom: '10px',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <p style={{ margin: 0, fontWeight: 'bold' }}>
                                    Item: {comment.itemTitle}
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.85em', color: '#777', marginRight: '15px' }}>
                                        {formatTimestamp(comment.timestamp)}
                                    </span>
                                    <button
                                        onClick={() => handleDeleteComment(comment)}
                                        style={{
                                            backgroundColor: '#dc3545',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            padding: '4px 8px',
                                            cursor: 'pointer',
                                            fontSize: '0.8em'
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <p style={{ margin: 0, backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '4px', borderLeft: '3px solid #007bff' }}>
                                {comment.user_comment}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HistoryComponent;