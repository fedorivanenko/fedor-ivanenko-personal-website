export type JobType = {
    jobTitle: string,
    timeline: { start: number, end: number | "Present" },
    companyName: string,
    companyDescription: string,
    description?: string[]
}

export type EducationType = {
    schoolName: string,
    degreeName: string,
    timeline: { start: number, end: number | "Present" | null },
}

export const eduList: EducationType[] = [
    {
        schoolName: "Western Governor University",
        degreeName: "BS Computer Science",
        timeline: {start:2024, end:2026}
    },
    {
        schoolName: "British High School of Art & Design",
        degreeName: "Graphic Design",
        timeline: {start:2015, end:2017}
    },
]

export const jobList: JobType[] = [
    {
        timeline: { start: 2022, end: "Present" },
        jobTitle: "UX Designer & Web Developer",
        companyName: "Freelance",
        companyDescription: "On my own",

        description: [
            "My moving to Portugal at 2021 made my work at Practicum unfeasible, so I move back to the core of what I'm doing — the design.",
            "Deeply believe that designer should deeply understand material that working with, I start learning front-end development progressing through React/Next.js ecosystem and animation libraries such @framer-motion or @react-spring.",
            "Since 2021 I've complete dozens of web-related projects, working all across the globe, from João Pessoa, Brazil to Los Angeles, California."
        ]
    },
    {
        timeline: { start: 2021, end: 2022 },
        jobTitle: "Customer Advocate",
        companyName: "Yandex Practicum",
        companyDescription: "Educational Tech Startup",

        description: [
            "Practicum is educational tech startup helping non-tech people to get a tech job. It was founded at 2019 and two years later was booming, expanding overseas. Starting as a Coding Bootcamp, Practicum very soon become an University, offering more then 40 different specialities.",
            "My part of the job was to give a voice to our customers and ensure that it's being heard. I've been spending days with our students and worked close to Product, Design and Faculty Leadership teams buildig communications and ensuring that the needs of our customers was met and challenges was helped.",
        ]
    },
    {
        timeline: { start: 2019, end: 2021 },
        jobTitle: "UX Researcher",
        companyName: "Freelance",
        companyDescription: "Several Agencies",

        description: [
            "Working at ZLT Group I felt growing interest to the UX design beyod spatial design. I obtained additional eduction in Product Management and User research and eventualy start working as an independent researcher.",
            "On a course of the next two years I've been woking with a several agencies on a project that varies from digital products to AR wafindign system. My job was to get the solid understaing of clients' customer needs and challenges and help to build a new (or optimize old one) line of business.",
        ]
    },
    {
        timeline: { start: 2016, end: 2019 },
        jobTitle: "Wayfinidng Designer",
        companyName: "ZLT Group",
        companyDescription: "Boutique Design Studio",

        description: [
            "ZLT group is the boutique (less then 15 people) design stuido focused on wayfinding solutions. Simply put, we was helping people to find a right direction and feel confident in unfamiliar places such as staudiums, parks, malls, offices, medical facilities and even cities.",
            "It was my first desgin job after graduating as Graphic Desginer from BHSAD. The studio's art-director have built an amazing team of unique specialists that I've been proud to be part of. We was one the very few teams (perhaps a few dozens or less) in the world that was (and still) able to build wyfinding systems for stadiums and skyscrappers completely on their own.",
            "My part of the job was developing wayfinding systems. Collect the data, undestand how the space works, design a UX and help other designers to render the system.",
            "But my biggest impact was systemyzing and automting the design process. I've made an album of standart solutions and a software tool that reduced time to design by 400%. When the COVID19 hit the planet, my system helps built a wayfinding to feild hospitals in matter of days, not weeks, as it was expected.",
        ]
    },
]