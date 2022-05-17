import { Page } from 'puppeteer';
import { CertificationSkelet } from '../../models/Certification';
import { EducationSkelet } from '../../models/Education';
import { ExperienceSkelet } from '../../models/Experience';
import { UserProfileSkelet } from '../../models/UserProfile';
import ProfilePage, { PROFILE_SELECTORS } from './ProfilePage';

const getProfileData = async (
  page: Page,
  uuid: string
): Promise<UserProfileSkelet> => {
  await page.exposeFunction('parseEducationArray', parseEducationArray);
  await page.exposeFunction('parseCertificationArr', parseCertificationArr);
  await page.exposeFunction('parseExperienceArray', parseExperienceArray);

  await page.waitForSelector(PROFILE_SELECTORS.DOWNLOAD_BUTTON);
  const downloadButton = await ProfilePage.getDownloadButton(page);
  await downloadButton.evaluate((b: any) => b.click());

  await page.waitForSelector(PROFILE_SELECTORS.MAIN_PROFILE_INFO_SECTION);

  return await page.evaluate(
    async (
      sectionHeaderSelector,
      mainProfileInfoSectionSelector,
      aboutMeSelector,
      experienceSelector,
      skillsSelector,
      educationSelector,
      certificationSelector,
      uuid
    ) => {
      const sectionHeader = document.querySelector(sectionHeaderSelector);
      const name = sectionHeader.querySelector('h3').innerText;

      const profileInfoSection = document.querySelector(
        mainProfileInfoSectionSelector
      );
      const profileInfoSectionChildren =
        profileInfoSection.querySelectorAll(':scope > *');

      const firstColumn = profileInfoSectionChildren[0].querySelectorAll(
        '.profileInfoStyle__wrap___102WU'
      );
      const role = firstColumn[0].textContent;
      const address = firstColumn[1].textContent;

      const secondColumn = profileInfoSectionChildren[1].querySelectorAll(
        '.profileInfoStyle__wrap___102WU'
      );
      const email = secondColumn[0].textContent;

      let website = '';
      if (secondColumn[1]) website = secondColumn[1].textContent;

      const thirdColumn = profileInfoSectionChildren[2].querySelectorAll(
        '.profileInfoStyle__wrap___102WU'
      );
      let phone = '';
      if (thirdColumn[1]) phone = secondColumn[1].textContent;

      const aboutMeSection = document.querySelector(aboutMeSelector);
      const aboutMe = aboutMeSection ? aboutMeSection.textContent : '';

      const experience = document.querySelector(experienceSelector);
      let experienceArray = Array.from(experience.querySelectorAll('li')).map(
        (el: any) => el.innerText
      );

      const parsedExperienceArr: ExperienceSkelet[] =
        await parseExperienceArray(experienceArray);

      const skills = document.querySelector(skillsSelector);
      const skillsChildren = skills.querySelectorAll(':scope > *');

      const mainSkills: string[] = Array.from(
        skillsChildren[1].querySelectorAll('div')
      ).map((el: any): string => el.innerText);
      const suggestedSkills: string[] = Array.from(
        skillsChildren[2].querySelectorAll('div')
      ).map((el: any): string => el.innerText.replace('+\n', ''));

      const educationArr: string[] = Array.from(
        document
          .querySelector(educationSelector)
          .querySelector('ul')
          .querySelectorAll('li')
      ).map((el: any): string => el.innerText);

      const parsedEducationArr: EducationSkelet[] = await parseEducationArray(
        educationArr
      );

      const certificationArr: string[] = Array.from(
        document
          .querySelector(certificationSelector)
          .querySelector('ul')
          .querySelectorAll('li')
      ).map(
        (el: any): string =>
          el.querySelector('.certificationStyle__entryBody___1f76-').innerText
      );
      const parsedCertificationArr: CertificationSkelet[] =
        await parseCertificationArr(certificationArr);

      const userProfile: UserProfileSkelet = {
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
        urlLink: `http://localhost:3001/userProfile/download?url=${uuid}`,
      };

      return Promise.resolve(userProfile);
    },
    PROFILE_SELECTORS.SECTION_HEADER,
    PROFILE_SELECTORS.MAIN_PROFILE_INFO_SECTION,
    PROFILE_SELECTORS.ABOUT_ME,
    PROFILE_SELECTORS.EXPERIENCE,
    PROFILE_SELECTORS.SKILLS,
    PROFILE_SELECTORS.EDUCATION_SECTION,
    PROFILE_SELECTORS.CERTIFICATION_SECTION,
    uuid
  );
};

const parseExperienceArray = async (
  experienceArray: string[]
): Promise<ExperienceSkelet[]> => {
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

const parseEducationArray = async (
  educationArr: string[]
): Promise<EducationSkelet[]> => {
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

const parseCertificationArr = async (
  certificationArr: string[]
): Promise<CertificationSkelet[]> => {
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

export { getProfileData };
