export interface KeywordItem {
    keyword: string;
    category: string;
    viewpoint: string | null;
    component_keywords: string[];
    proof: string;
}

export interface Keywords {
    list_of_keywords: KeywordItem[];
}