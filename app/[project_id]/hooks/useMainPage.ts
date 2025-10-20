import { useMainPageStore } from "../store/mainPageStore"
export const useMainPage = (projectId: string) => {
    const setProjectId = useMainPageStore((state) => state.setProjectId);
    const setProject = useMainPageStore((state) => state.setProject);
    const setActiveDecoding = useMainPageStore((state) => state.setActiveDecoding);
    const setLoadingText = useMainPageStore((state) => state.setLoadingText);
    const setIsDialogOpen = useMainPageStore((state) => state.setIsDialogOpen);
    const setIsCorrectingDecodings = useMainPageStore((state) => state.setIsCorrectingDecodings);

    
    setProjectId(projectId);   

}
