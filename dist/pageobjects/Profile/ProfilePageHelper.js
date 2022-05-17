"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfileData = void 0;
const ProfilePageSelectors_1 = require("./ProfilePageSelectors");
require('dotenv').config();
const getProfileData = async (page, uuid) => {
    // expose outside functions
    await page.exposeFunction('parseEducationArray', parseEducationArray);
    await page.exposeFunction('parseCertificationArr', parseCertificationArr);
    await page.exposeFunction('parseExperienceArray', parseExperienceArray);
    // download pdf
    await page.waitForSelector(ProfilePageSelectors_1.PROFILE_SELECTORS.DOWNLOAD_BUTTON);
    const downloadButton = await getDownloadButton(page);
    await downloadButton.evaluate((b) => b.click());
    await page.waitForSelector(ProfilePageSelectors_1.PROFILE_SELECTORS.MAIN_PROFILE_INFO_SECTION);
    // TODO: had a plan to increase modularity and reusability of this function and its parts, but didn't manage to, since I did not find a way to pass root document object to external functions from evaluate
    // do everything in one api call with evaluate
    return await page.evaluate(async (sectionHeaderSelector, mainProfileInfoSectionSelector, sectionContentSelector, aboutMeSelector, experienceSelector, skillsSelector, educationSelector, certificationSelector, uuid, url, port) => {
        try {
            const sectionHeader = document.querySelector(sectionHeaderSelector);
            const name = sectionHeader.querySelector('h3').innerText;
            const profileInfoSection = document.querySelector(mainProfileInfoSectionSelector);
            const profileInfoSectionChildren = profileInfoSection.querySelectorAll(':scope > *');
            const firstColumn = profileInfoSectionChildren[0].querySelectorAll(sectionContentSelector);
            const role = firstColumn[0].textContent;
            const address = firstColumn[1].textContent;
            const secondColumn = profileInfoSectionChildren[1].querySelectorAll(sectionContentSelector);
            const email = secondColumn[0].textContent;
            let website = '';
            if (secondColumn[1])
                website = secondColumn[1].textContent;
            const thirdColumn = profileInfoSectionChildren[2].querySelectorAll(sectionContentSelector);
            let phone = '';
            if (thirdColumn[1])
                phone = secondColumn[1].textContent;
            const aboutMeSection = document.querySelector(aboutMeSelector);
            const aboutMe = aboutMeSection ? aboutMeSection.textContent : '';
            const experience = document.querySelector(experienceSelector);
            let experienceArray = Array.from(experience.querySelectorAll('li')).map((el) => el.innerText);
            const parsedExperienceArr = await parseExperienceArray(experienceArray);
            const skills = document.querySelector(skillsSelector);
            const skillsChildren = skills.querySelectorAll(':scope > *');
            const mainSkills = Array.from(skillsChildren[1].querySelectorAll('div')).map((el) => el.innerText);
            const suggestedSkills = Array.from(skillsChildren[2].querySelectorAll('div')).map((el) => el.innerText.replace('+\n', ''));
            const educationArr = Array.from(document
                .querySelector(educationSelector)
                .querySelector('ul')
                .querySelectorAll('li')).map((el) => el.innerText);
            const parsedEducationArr = await parseEducationArray(educationArr);
            const certificationArr = Array.from(document
                .querySelector(certificationSelector)
                .querySelector('ul')
                .querySelectorAll('li')).map((el) => el.querySelector('.certificationStyle__entryBody___1f76-').innerText);
            const parsedCertificationArr = await parseCertificationArr(certificationArr);
            const userProfile = {
                name: name,
                role: role,
                address: address,
                email: email,
                website: website,
                phone: phone,
                aboutMe: aboutMe,
                experience: parsedExperienceArr,
                mainSkills: mainSkills,
                suggestedSkills: suggestedSkills,
                education: parsedEducationArr,
                certification: parsedCertificationArr,
                url: uuid,
                urlLink: `${url + port}/userProfile/download?url=${uuid}`,
            };
            return Promise.resolve(userProfile);
        }
        catch (err) {
            throw new Error(err.message);
        }
    }, ProfilePageSelectors_1.PROFILE_SELECTORS.SECTION_HEADER, ProfilePageSelectors_1.PROFILE_SELECTORS.MAIN_PROFILE_INFO_SECTION, ProfilePageSelectors_1.PROFILE_SELECTORS.SECTION_CONTENT, ProfilePageSelectors_1.PROFILE_SELECTORS.ABOUT_ME, ProfilePageSelectors_1.PROFILE_SELECTORS.EXPERIENCE, ProfilePageSelectors_1.PROFILE_SELECTORS.SKILLS, ProfilePageSelectors_1.PROFILE_SELECTORS.EDUCATION_SECTION, ProfilePageSelectors_1.PROFILE_SELECTORS.CERTIFICATION_SECTION, uuid, process.env.URL ? process.env.URL : 'http://localhost', 
    // add port if local env
    (!process.env.ENV || process.env.ENV === 'DEV') ? `:${process.env.PORT2}` : '');
};
exports.getProfileData = getProfileData;
const parseExperienceArray = async (experienceArray) => {
    return experienceArray.map((experience) => {
        const experienceArr = experience.split('\n');
        return {
            role: experienceArr[0],
            companyName: experienceArr[1],
            location: experienceArr[2],
            period: experienceArr[3],
            description: experienceArr[5],
        };
    });
};
const parseEducationArray = async (educationArr) => {
    return educationArr.map((education) => {
        const educationArr = education.split('\n');
        return {
            institutionName: educationArr[0],
            level: educationArr[1],
            location: educationArr[2],
            period: educationArr[3],
            description: educationArr[5],
        };
    });
};
const parseCertificationArr = async (certificationArr) => {
    return certificationArr.map((certification) => {
        const certificationArr = certification.split('\n');
        return {
            certificateName: certificationArr[0],
            certificateIssuer: certificationArr[1],
            period: certificationArr[2],
            description: certificationArr[4],
        };
    });
};
const getDownloadButton = async (page) => {
    return (await page.$$(ProfilePageSelectors_1.PROFILE_SELECTORS.DOWNLOAD_BUTTON))[1];
};
//# sourceMappingURL=ProfilePageHelper.js.map