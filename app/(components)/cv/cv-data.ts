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
            "My move to Poland in 2021 made my work at Practicum unfeasible, so I shifted back to the core of what I do — design.",
            "Deeply believing that a designer should thoroughly understand the material they work with, I started learning front-end development, progressing through the React/Next.js ecosystem and animation libraries such as @framer-motion and @react-spring.",
            "Since 2021, I've completed dozens of web-related projects, working across the globe, from João Pessoa, Brazil, to Los Angeles, California."
        ]
    },
    {
        timeline: { start: 2021, end: 2022 },
        jobTitle: "Customer Advocate",
        companyName: "Yandex Practicum",
        companyDescription: "Educational Tech Startup",

        description: [
            "Practicum is an educational tech startup that helps non-tech people land a tech job. It was founded in 2019, and two years later, it was booming, expanding overseas. Starting as a coding bootcamp, Practicum quickly grew into a university, offering dozens different specialties.",
            "My part of the job was to give a voice to our customers and ensure it was being heard. I spent days with our students and worked closely with the Product, Design, and Faculty Leadership teams, building communications and ensuring that our customers' needs were met and their challenges addressed.",
        ]
    },
    {
        timeline: { start: 2019, end: 2021 },
        jobTitle: "UX Researcher",
        companyName: "Freelance",
        companyDescription: "Several Agencies",

        description: [
            "Working at ZLT Group, I developed a growing interest in UX design beyond spatial design. I obtained additional education in Product Management and User Research, and eventually started working as an independent researcher.",
            "Over the course of the next two years, I worked with several agencies on projects ranging from digital products to AR wayfinding systems. My job was to gain a solid understanding of clients' customer needs and challenges and help build a new (or optimize an existing) line of business.",
        ]
    },
    {
        timeline: { start: 2016, end: 2019 },
        jobTitle: "Wayfinidng Designer",
        companyName: "ZLT Group",
        companyDescription: "Boutique Design Studio",

        description: [
            "ZLT Group is a boutique (fewer than 15 people) design studio focused on wayfinding solutions. Simply put, we helped people find the right direction and feel confident in unfamiliar places such as stadiums, parks, malls, offices, medical facilities, and even cities.",
            "It was my first design job after graduating as a Graphic Designer from BHSAD. The studio's art director had built an amazing team of unique specialists, and I was proud to be part of it. We were one of the very few teams (perhaps a few dozen or fewer) in the world that was (and still is) able to build wayfinding systems for stadiums and skyscrapers entirely on our own.",
            "My part of the job was developing wayfinding systems. I collected data, understood how the space worked, designed the UX, and helped other designers render the system.",
            "My biggest impact was systematizing and automating the design process. I created an album of standard solutions and a software tool that reduced design time by 400%. When COVID-19 hit, my system helped build wayfinding for field hospitals in a matter of days, not weeks, as initially expected.",
        ]
    },
]