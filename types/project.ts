
import { SearchStream } from "./searchStream"
import { StreamState } from "./streamState"

export interface ProjectState {
    session_id: string
    project_name: string
    request_email: string
    brief_summary: string
    search_streams: SearchStream[]
    stream_states: StreamState[]
}
