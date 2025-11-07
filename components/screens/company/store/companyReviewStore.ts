import { Expert } from "@/lib/data"
import { capitalizeFirstLetter, StreamState } from "@/types/streamState"
import { create } from 'zustand'

export type CompanyReviewState = {
    streamState: StreamState
    sessionId: string
    newCompany: string | undefined
    matchingCompaniesInDb: string[] | undefined
    displayedCompanies: string[] | undefined
}


type CompanyReviewAction = {
    setStreamState: (streamState: StreamState) => void
    setSessionId: (sessionId: string) => void
    setNewCompany: (newCompany: string | undefined) => void
    setMatchingCompaniesInDb: (matchingCompaniesInDb: string[] | undefined) => void
    setDisplayedCompanies: (displayedCompanies: string[] | undefined) => void
    removeCompany: (company: string) => void
    addCompany: (company: string) => void
}
const getInitialState = (streamState: StreamState, sessionId: string): CompanyReviewState => ({
    streamState,
    sessionId,
    matchingCompaniesInDb: [],
    newCompany: undefined,
    displayedCompanies: [],
})

export const useCompanyReviewStore = create<CompanyReviewState & CompanyReviewAction>((set) => ({
    ...getInitialState({} as StreamState, ""),
    setStreamState: (streamState: StreamState) => set(() => ({ streamState })),
    setSessionId: (sessionId: string) => set(() => ({ sessionId })),
    setNewCompany: (newCompany: string | undefined) => set(() => ({ newCompany })),
    setMatchingCompaniesInDb: (matchingCompaniesInDb: string[] | undefined) => set(() => ({ matchingCompaniesInDb })),
    setDisplayedCompanies: (matchingCompaniesInDb: string[] | undefined) => {
        const uniqueCompaniesMap = new Map<string, string>();
        (matchingCompaniesInDb || []).forEach(companyName => {
            if (!companyName) return;

            const lowerCaseName = companyName.toLowerCase();


            if (!uniqueCompaniesMap.has(lowerCaseName)) {

                const capitalizedName = capitalizeFirstLetter(companyName);
                uniqueCompaniesMap.set(lowerCaseName, capitalizedName);
            }
        });
        const displayedCompanies = Array.from(uniqueCompaniesMap.values());
        set(() => ({ displayedCompanies }))

    },
    removeCompany: (company: string) => set((state) => ({
        //the company to remove will be from the displayed companies
        //check if it matches several companies with different 
        //casing in teh matching companies in db
        displayedCompanies: state.displayedCompanies?.filter((c) => c !== company),
        // also remove all matching companies from the matching companies in db remove anything case insensitive
        matchingCompaniesInDb: state.matchingCompaniesInDb?.filter((c) => c.toLowerCase() !== company.toLowerCase()),

    })),
    addCompany: (company: string) => set((state) => ({
        matchingCompaniesInDb: state.matchingCompaniesInDb ? [...state.matchingCompaniesInDb, company] : [company],
        displayedCompanies: state.displayedCompanies ? [...state.displayedCompanies, company] : [company],
    })),
})) 