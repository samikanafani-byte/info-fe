export interface KeywordItem {
    keyword: string;
    category: string;
    viewpoint: string | null;
    component_keywords: string[];
    proof?: string;
}

export interface Keywords {
    list_of_keywords: KeywordItem[];
}

const keys = {
    "keywords": {
        "list_of_keywords": [
            {
                "keyword": "Material Management",
                "category": "function",
                "viewpoint": "Viewpoint 3: Operators",
                "component_keywords": [
                    "material",
                    "critical",
                    "classify",
                    "inventory",
                    "stock",
                    "asset"
                ],
                "proof": "This function is critical for understanding how materials are defined, classified, and managed internally within power plants."
            },
            {
                "keyword": "Supply Chain",
                "category": "function",
                "viewpoint": "Viewpoint 3: Operators",
                "component_keywords": [
                    "supply",
                    "chain",
                    "logistics",
                    "material",
                    "flow",
                    "internal"
                ],
                "proof": "Essential for understanding the movement and handling of critical materials from a plant's internal perspective."
            },
            {
                "keyword": "Plant Operations",
                "category": "function",
                "viewpoint": "Viewpoint 3: Operators",
                "component_keywords": [
                    "plant",
                    "operation",
                    "generation",
                    "power",
                    "facility",
                    "asset"
                ],
                "proof": "This function is central to how critical materials impact the daily running and efficiency of power generation facilities."
            },
            {
                "keyword": "Maintenance",
                "category": "function",
                "viewpoint": "Viewpoint 3: Operators",
                "component_keywords": [
                    "maintenance",
                    "repair",
                    "upkeep",
                    "asset",
                    "equipment",
                    "plant"
                ],
                "proof": "Critical materials classification directly impacts maintenance strategies and scheduling within power plants."
            },
            {
                "keyword": "Procurement",
                "category": "function",
                "viewpoint": "Viewpoint 3: Operators",
                "component_keywords": [
                    "procure",
                    "purchase",
                    "acquire",
                    "sourcing",
                    "internal",
                    "material"
                ],
                "proof": "Understanding how critical material classification influences internal purchasing decisions and processes."
            },
            {
                "keyword": "Material Criticality",
                "category": "knowledge_gap",
                "viewpoint": null,
                "component_keywords": [
                    "material",
                    "critical",
                    "importance",
                    "essential",
                    "impact",
                    "risk"
                ],
                "proof": "Directly addresses the need to understand the criteria and methodologies for defining what makes a material critical."
            },
            {
                "keyword": "Classification Frameworks",
                "category": "knowledge_gap",
                "viewpoint": null,
                "component_keywords": [
                    "classify",
                    "framework",
                    "methodology",
                    "model",
                    "system",
                    "approach",
                    "material"
                ],
                "proof": "Fills the gap regarding existing frameworks and structured approaches for critical material classification."
            },
            {
                "keyword": "Material Lifecycle",
                "category": "knowledge_gap",
                "viewpoint": null,
                "component_keywords": [
                    "material",
                    "lifecycle",
                    "inventory",
                    "stock",
                    "obsolescence",
                    "spare",
                    "part"
                ],
                "proof": "Helps understand the broader context of critical material management from acquisition to disposal, including spare parts and obsolescence."
            },
            {
                "keyword": "Risk Assessment",
                "category": "knowledge_gap",
                "viewpoint": null,
                "component_keywords": [
                    "risk",
                    "assess",
                    "evaluate",
                    "impact",
                    "failure",
                    "consequence",
                    "mitigation"
                ],
                "proof": "Addresses the underlying reasons for material criticality, often related to operational risks and potential failures."
            },
            {
                "keyword": "Inventory Optimization",
                "category": "knowledge_gap",
                "viewpoint": null,
                "component_keywords": [
                    "inventory",
                    "optimize",
                    "stock",
                    "level",
                    "spare",
                    "part",
                    "holding",
                    "cost"
                ],
                "proof": "Addresses how critical material classification influences inventory strategies and efficiency."
            },
            {
                "keyword": "Manager",
                "category": "seniority",
                "viewpoint": null,
                "component_keywords": [
                    "Management"
                ],
                "proof": "Self-evident."
            },
            {
                "keyword": "Head",
                "category": "seniority",
                "viewpoint": null,
                "component_keywords": [
                    "Head of",
                    "Leading"
                ],
                "proof": "Self-evident."
            },
            {
                "keyword": "Director",
                "category": "seniority",
                "viewpoint": null,
                "component_keywords": [
                    "Direction",
                    "Executive"
                ],
                "proof": "Self-evident."
            },
            {
                "keyword": "VP",
                "category": "seniority",
                "viewpoint": null,
                "component_keywords": [
                    "Vice President",
                    "SVP",
                    "EVP"
                ],
                "proof": "Self-evident."
            },
            {
                "keyword": "Supervisor",
                "category": "seniority",
                "viewpoint": null,
                "component_keywords": [
                    "Supervision",
                    "Oversight"
                ],
                "proof": "Self-evident."
            },
            {
                "keyword": "Lead",
                "category": "seniority",
                "viewpoint": null,
                "component_keywords": [
                    "Leader",
                    "Leadership"
                ],
                "proof": "Self-evident."
            },
            {
                "keyword": "Principal",
                "category": "seniority",
                "viewpoint": null,
                "component_keywords": [],
                "proof": "Self-evident."
            },
            {
                "keyword": "Chief",
                "category": "seniority",
                "viewpoint": null,
                "component_keywords": [],
                "proof": "Self-evident."
            },
            {
                "keyword": "Global",
                "category": "scope",
                "viewpoint": null,
                "component_keywords": [
                    "Worldwide",
                    "International"
                ],
                "proof": "Self-evident."
            },
            {
                "keyword": "Power Generation",
                "category": "scope",
                "viewpoint": null,
                "component_keywords": [
                    "Utility",
                    "Energy",
                    "Plant"
                ],
                "proof": "Self-evident."
            },
            {
                "keyword": "Nuclear Power",
                "category": "scope",
                "viewpoint": null,
                "component_keywords": [
                    "Nuclear",
                    "Reactor"
                ],
                "proof": "Self-evident."
            },
            {
                "keyword": "Thermal Power",
                "category": "scope",
                "viewpoint": null,
                "component_keywords": [
                    "Fossil Fuel",
                    "Coal",
                    "Gas",
                    "Steam"
                ],
                "proof": "Self-evident."
            },
            {
                "keyword": "Renewable Energy",
                "category": "scope",
                "viewpoint": null,
                "component_keywords": [
                    "Solar",
                    "Wind",
                    "Hydro",
                    "Geothermal"
                ],
                "proof": "Self-evident."
            },
            {
                "keyword": "Heavy Industrial",
                "category": "scope",
                "viewpoint": null,
                "component_keywords": [
                    "Manufacturing",
                    "Industrial"
                ],
                "proof": "Self-evident."
            }
        ]
    }
}
