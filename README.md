# mistho-scrapper

This API provides scrapping utility for Glassdoor website. API is written in NodeJS along with Express framework, using Typescript. API is contained from 2 APIs where first one is meant for scrapping jobs, and the other one is used for retrieving persisted data from database.

- [Installation](#installation)
- [Usage](#usage)
- [Decision making](#decision-making)
- [Load testing](#load-testing)

## Installation

There are multiple ways you are able to start this project.

1. First and easier one is using `docker-compose` with command `docker-compose up` at the root of the repository. This will setup everything along with ENV variables which are for this purpose contained at the Dockerfile. After this you will have application running and database setup.

2. Second way requires a bit more work since you need mongoDB service instance at port 27017. Second part is creating `.env` file which will contain all values from ENV variables from Dockerfile, but DB_HOST value is updated to 0.0.0.0 from mongo. This step is needed so our service knows where to look for db. After setting up mongo and .env you just need to run `npm run start` which will transpile Typescript code into the js and start it.

## Usage

If we follow default settings for the ports [3000, 3001] we would be able to call the API in the next way.

1. First API is meant for scrapping, and by default on the local machine it will get exposed through localhost. POST `http://localhost:3000/`

The only exposed endpoint for this API is one for scrapping and you can call it with `POST` request with body defined like

```js
    const body = {
        "username" : "test",
        "password" : "test"
    }
```

If the scrapping was successful user will get response in format of `UserProfileSkelet` document.

```js
{
    "_id" : ObjectId("6284c6e97f71649264a17b34"),
    "mainSkills" : [
        "C#.NET",
        ".NET CORE",
        "Asp.Net",
        "Microsoft SQL Server",
        "Azure",
        "Angular",
        "Angular 2",
        "Javascript",
        "JQuery",
        "HTML",
        "CSS"
    ],
    "suggestedSkills" : [
        "Css3",
        "Hibernate",
        "Meditation",
        "Html5"
    ],
    "name" : "Ravi Van",
    "role" : "Senior Software Engineer",
    "address" : "London, England (United Kingdom)",
    "email" : "ravi.van.test@gmail.com",
    "website" : "",
    "phone" : "",
    "aboutMe" : "About MeI am a software engineer with a particular interest in making things simple and automating daily tasks. I try to keep up with security and best practices, and am always looking for new things to learn.",
    "experience" : [
        {
            "_id" : ObjectId("6284c6e97f71649264a17b35"),
            "role" : "Senior Software Engineer",
            "companyName" : "Hastha Solutions",
            "location" : "London, England (UK)",
            "period" : "Jan 2018 - Sep 2020",
            "description" : "Is a software development workshop with a focus on RFID and product tracking.",
            "createdAt" : ISODate("2022-05-18T10:14:01.138+0000"),
            "updatedAt" : ISODate("2022-05-18T10:14:01.138+0000")
        },
        {
            "_id" : ObjectId("6284c6e97f71649264a17b36"),
            "role" : "Software Engineer",
            "companyName" : "US Postal Service",
            "location" : "Washington, DC (US)",
            "period" : "Sep 2014 - Jan 2018",
            "description" : "I was responsible for the development and management of automated online data whose data is used to legally work. I was ultimately given the role of social media platform (, on orange group, a) before graduation, and also part of an application development environments in both a large marketing and organization, setting up the a custom java internal platform.",
            "createdAt" : ISODate("2022-05-18T10:14:01.138+0000"),
            "updatedAt" : ISODate("2022-05-18T10:14:01.138+0000")
        }
    ],
    "education" : [
        {
            "_id" : ObjectId("6284c6e97f71649264a17b37"),
            "institutionName" : "London Engineering School",
            "level" : "Bachelor's Degree, Information Technology",
            "location" : "London, England (UK)",
            "period" : "Oct 2009 - Sep 2014",
            "description" : "Updated education",
            "createdAt" : ISODate("2022-05-18T10:14:01.138+0000"),
            "updatedAt" : ISODate("2022-05-18T10:14:01.138+0000")
        }
    ],
    "certification" : [
        {
            "_id" : ObjectId("6284c6e97f71649264a17b38"),
            "certificateName" : "Azure Cloud Developer",
            "certificateIssuer" : "Microsoft",
            "period" : "Feb 2018 - Feb 2022",
            "description" : "Attended a 2-week seminar with workshops and exams.",
            "createdAt" : ISODate("2022-05-18T10:14:01.138+0000"),
            "updatedAt" : ISODate("2022-05-18T10:14:01.138+0000")
        }
    ],
    "url" : "cde170dd-921a-446a-bd52-70e8ba56f495",
    "urlLink" : "http://localhost:3001/userProfile/download?url=cde170dd-921a-446a-bd52-70e8ba56f495",
    "createdAt" : ISODate("2022-05-18T10:14:01.139+0000"),
    "updatedAt" : ISODate("2022-05-18T10:14:01.139+0000"),
    "__v" : NumberInt(0)
}
```
2. Second API that is exposed on port 3001 has few endpoints. 

- Get single user profile data by email: GET `http://localhost:3001/userProfile?email=test@email.com`
- Get all user profile data: GET `http://localhost:3001/userProfile/all`
- Download user profile data in pdf: GET `http://localhost:3001/userProfile/download?url=4ed3580a-eff7-4c11-a409-7842a11192f0`

Download link will be provided to the user after starting the scrapping process.

## Decision Making

The most important thing of making this API is making it optimized, so it can handle big amount of traffic and not brake. To make it optimized and for its testing, various tools were used.

1. There are separated processes for Scrapping and retrieving data. On start of the program, one `child_process` is spawned for handling reading from database, on port 3001. Reason for this is pretty clear, we want to serve files immediately, and we don't want scrapping to be handling those kind of transactions.

2. MongoDB. Fast writing time in data similar to RAW data was pretty important, since when there is a lot of traffic this would be the bottleneck. There are defined some relations between the entities, but not strong enough to justify relational database at this point. Improvement possibility: Instead of writing with scrapper, we can emit event to child with RAW data, and the child can handle writing data as well. Didn't want to overkill it by doing this, but it's there as idea.

3. NodeJS Cluster module - Essence of every production NodeJS application, we are getting number of CPUs and creating that many Express servers to listen at the same time on the same port. 

4. Puppeteer cluster module - Used in combination with NodeJS's cluster module, to limit concurrency of browsers, since when API is handling 50 scrapping at the same, biggest issue would be too much instances of the Chrome. So it needs to be restricted to some reasonable number. And for that we used this super cool module.


## Load testing

For purpose of load testing, K6 is used. In the root of this directory there is file called `load_test.js`, which can be run with command `k6 run ./load_test.js -i 50 -vu 50`. Before running it you have to install k6 first https://k6.io/docs/getting-started/installation/ . Running this test, API was able to handle 50 simultaneous requests at the same time. API was able to handle it without errors multiple times. There were some times when success rate was about 40/50, but this was not due to API mistakes, rather it was cause by Glassdoor website where they sometimes reject login without reason, just saying Try again. On picture `k6s_50scrappers_results` you can see some statistics from time where all 50 requests where handled properly. 

![alt text](https://github.com/Pantela996/mistho-scrapper/blob/feature/scrapper/k6s_50scrappers_results.png?raw=true)
