import { Page } from "puppeteer"
import { UserProfileSkelet } from "../../models/UserProfile";
import { PROFILE_SELECTORS } from "./ProfilePage";

const getData = async (page: Page, uuid: string) : Promise<UserProfileSkelet> => {
    return await page.evaluate(async (sectionHeaderSelector, mainProfileInfoSectionSelector, aboutMeSelector, experienceSelector, skillsSelector, educationSelector, certificationSelector, uuid) => {
            const sectionHeader = document.querySelector(sectionHeaderSelector);
            const name = sectionHeader.querySelector('h3').innerText;

            const profileInfoSection = document.querySelector(mainProfileInfoSectionSelector);
            const profileInfoSectionChildren = profileInfoSection.querySelectorAll(':scope > *');
            
            const firstColumn = profileInfoSectionChildren[0].querySelectorAll(".profileInfoStyle__wrap___102WU");
            const role = firstColumn[0].textContent;
            const address = firstColumn[1].textContent;
            
            const secondColumn = profileInfoSectionChildren[1].querySelectorAll(".profileInfoStyle__wrap___102WU");
            const email = secondColumn[0].textContent;
            
            let website = '';
            if (secondColumn[1]) website = secondColumn[1].textContent;

            const thirdColumn = profileInfoSectionChildren[2].querySelectorAll(".profileInfoStyle__wrap___102WU");
            let phone = '';
            if (thirdColumn[1]) phone = secondColumn[1].textContent;
            

            const aboutMeSection = document.querySelector(aboutMeSelector);
            const aboutMe = aboutMeSection ? aboutMeSection.textContent : '';

            const experience = document.querySelector(experienceSelector);
            const experienceArray = Array.from(experience.querySelectorAll('li')).map((el : any) => el.innerText);
            
            const skills = document.querySelector(skillsSelector);
            const skillsChildren = skills.querySelectorAll(':scope > *');
            
            const mainSkills: string[] = Array.from(skillsChildren[1].querySelectorAll('div')).map((el: any): string => el.innerText);
            const suggestedSkills: string[] = Array.from(skillsChildren[2].querySelectorAll('div')).map((el: any): string => el.innerText.replace('+\n', ''));

            const education: string[] = Array.from(document.querySelector(educationSelector).querySelector('ul').querySelectorAll('li')).map((el : any): string => el.innerText);
            const certification: string[] = Array.from(document.querySelector(certificationSelector).querySelector('ul').querySelectorAll('li')).map((el : any): string => el.querySelector('.certificationStyle__entryBody___1f76-').innerText);

            const userProfile : UserProfileSkelet = {
                name: name,
                role: role,
                address: address,
                email: email,
                website: website,
                phone: phone,
                aboutMe: aboutMe,
                experience: experienceArray,
                mainSkills: mainSkills,
                suggestedSkills: suggestedSkills,
                education: education,
                certification: certification,
                url: uuid
            }

            return Promise.resolve(userProfile);
        }, PROFILE_SELECTORS.SECTION_HEADER, PROFILE_SELECTORS.MAIN_PROFILE_INFO_SECTION, PROFILE_SELECTORS.ABOUT_ME, PROFILE_SELECTORS.EXPERIENCE, PROFILE_SELECTORS.SKILLS, PROFILE_SELECTORS.EDUCATION_SECTION, PROFILE_SELECTORS.CERTIFICATION_SECTION, uuid)
}

const parseExperienceArray = (experience : string[]) => {
    const experienceArr = Array.from(experience);
    
}


export default getData;