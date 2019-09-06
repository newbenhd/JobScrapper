const INDEED_URIS = [
  'https://www.indeed.com/q-full-stack-$115,000-l-Los-Angeles-jobs.html',
  'https://www.indeed.com/q-backend-$115,000-l-Los-Angeles-jobs.html',
  'https://www.indeed.com/q-Full-Stack-Developer-$110,000-l-Orange-County,-CA-jobs.html',
  'https://www.indeed.com/q-full-stack-$105,000-l-Orange-County-jobs.html',
  'https://www.indeed.com/q-backend-$110,500-l-Orange-County-jobs.html',
];

const GLASSDOOR_URIS = [
  'https://www.glassdoor.com/Job/jobs.htm?sc.keyword=Full%20Stack%20Developer&locT=C&locId=1146763&locKeyword=Cerritos,%20CA&jobType=fulltime&fromAge=-1&minSalary=104000&includeNoSalaryJobs=true&radius=25&cityId=-1&minRating=0.0&industryId=-1&sgocId=-1&seniorityType=all&companyId=-1&employerSizes=0&applicationType=0&remoteWorkType=0',
  'https://www.glassdoor.com/Job/jobs.htm?sc.keyword=Full%20Stack%20Developer&locT=C&locId=1146821&locKeyword=Los%20Angeles,%20CA&jobType=fulltime&fromAge=3&minSalary=104000&includeNoSalaryJobs=true&radius=25&cityId=-1&minRating=0.0&industryId=-1&sgocId=-1&seniorityType=all&companyId=-1&employerSizes=0&applicationType=0&remoteWorkType=0',
];

$(document).ready(function() {
  craigListFetch('software').then((jobs)=>{
    for(const job of jobs) {
      const cardDOM = $(`<div class="card"><div class="title"><a href="${job.link}" class="link">${job.jobTitle}</a></div><div class="location">${job.location}</div><div class="select"><button class="select-btn">Add</button></div></div>`)
      $('#craiglist-list').append(cardDOM);
    }
  });
  for(const uri of INDEED_URIS) {
    indeed(uri).then((jobs) => {
      for(const job of jobs) {
        const cardDOM = $(`<div class="card"><div class="title"><a href="${job.link}" class="link">${job.jobTitle}</a></div><div class="location">${job.location}</div><div class="select"><button class="select-btn">Add</button></div></div>`)
        $('#indeed-list').append(cardDOM);
      }
    });
  }
  for(const uri of GLASSDOOR_URIS) {
    glassdoor(uri).then(jobs => {
      console.log(jobs);
      for(const job of jobs) {
        const cardDOM = $(`<div class="card"><div class="title"><a href="${job.link}" class="link">${job.jobTitle}</a></div><div class="location">${job.location}</div><div class="select"><button class="select-btn">Add</button></div></div>`)
        $('#glassdoor-list').append(cardDOM);
      }
    });
  }
  // indeedFetch({q: 'Full Stack', l: 'Los Angeles'}).then(jobs=>{
  //   for(const job of jobs) {
  //     const cardDOM = $(`<div class="card"><div class="title"><a href="${job.link}" class="link">${job.jobTitle}</a></div><div class="location">${job.location}</div><div class="select"><button class="select-btn">Add</button></div></div>`)
  //     $('#indeed-list').append(cardDOM);
  //   }
  // });

  // -----------> toggle job list <-------------
  $('#bookmark-toggle').on('click',function(){
    $('#bookmark-list').toggle("blind", 200);
  });
  $('#indeed-toggle').on('click',function(){
    $('#indeed-list').toggle("blind", 200);
  });
  $('#glassdoor-toggle').on('click',function(){
    $('#glassdoor-list').toggle("blind", 200);
  });
  $('#craiglist-toggle').on('click',function(){
    $('#craiglist-list').toggle("blind", 200);
  });

  $('#menu-form').submit(function(event) {
    event.preventDefault();
    const input = event.target.keyword;
    const keyword = input.value;
    const li = $(`<li class="tag">${keyword}</li>`);
    $('.keyword-list ul').append(li);
    input.value = '';
  });

  $('.tag').on('click', function(event) {
    console.log('clicked');
    console.log(event.target);
  });
});

const glassdoor = (url) => new Promise((resolve, reject) => {
  const jobs = [];
  $.get(url, function(data) {
    const glassdoorDOM = $(data);
    const listOfJobs = glassdoorDOM.find('.jlGrid .jl');
    listOfJobs.each(function(index) {
      const jobTitle = $(this).find('.jobLink').text();
      const link = 'https://www.glassdoor.com' + $(this).find('.jobLink').attr('href');
      const location = $(this).find('.loc').text();
      const salaryDOM = $(this).find('.salaryText');
      const salary = salaryDOM.length > 0 ? salaryDOM.text().trim() : '';
      const jobObject = {
        jobTitle,
        link,
        location,
        salary
      };
      jobs.push(jobObject);
    });
    resolve(jobs);
  });
});

const indeed = (url) => new Promise((resolve, reject) => {
  const jobs = [];
  $.get(url, function(data) {
    const indeedDOM = $(data);
    const listOfJobs = indeedDOM.find('#resultsCol .jobsearch-SerpJobCard');
    listOfJobs.each(function(index){
      const jobTitle = $(this).find('.jobtitle').attr('title');
      const link = 'https://www.indeed.com' + $(this).find('.jobtitle').attr('href');
      const location = $(this).find('.sjcl .location').text();
      const salaryDOM = $(this).find('.salarySnippet');
      const salary = salaryDOM.length > 0 ? salaryDOM.find('.salaryText').text().trim() : '';
      const jobObject = {
        jobTitle,
        link,
        location,
        salary
      };
      jobs.push(jobObject);
    });
    resolve(jobs);
  });
});



const indeedFetch = (query) => { // query is object with
  const urlQuery = $.param(query);
  return new Promise((resolve, reject) => {
    const arrayOfJobList = [];
    const uri = `https://www.indeed.com/jobs?${urlQuery}`;
    // const uris = [
    //   uri,
    //   `${uri}&start=10`,
    //   `${uri}&start=20`,
    //   `${uri}&start=30`,
    // ]; // total fourty items
    // uris.forEach(url => {
    //
    // });
    $.get(uri, function(data){
      const indeedDOM = $(data);
      const listOfJobs = indeedDOM.find('#resultsCol .jobsearch-SerpJobCard');
      listOfJobs.each(function(index){
        const jobTitle = $(this).find('.jobtitle').attr('title');
        const link = 'https://www.indeed.com' + $(this).find('.jobtitle').attr('href');
        const location = $(this).find('.sjcl .location').text();
        const salaryDOM = $(this).find('.salarySnippet');
        const salary = salaryDOM.length > 0 ? salaryDOM.find('.salaryText').text().trim() : '';
        const jobObject = {
          jobTitle,
          link,
          location,
          salary
        };
        arrayOfJobList.push(jobObject);
      });
      resolve(arrayOfJobList);
    });
  });
};

const craigListFetch = (query) => {
  return new Promise((resolve, reject)=>{
    const arrayOfJobList = [];
    $.get('https://losangeles.craigslist.org/d/software-qa-dba-etc/search/sof', function(data){
      const craiglistDOM = $(data);
      const listOfJobs = craiglistDOM.find('.rows .result-row');
      listOfJobs.each(function(index){
        const time = $(this).find('.result-info time').attr('title'); // this grabs title attribute from time dom element
        const jobTitle = $(this).find(".result-title.hdrlnk").text();
        const link = $(this).find('.result-title.hdrlnk').attr("href");
        const locationDOM = $(this).find('.result-hood');
        const location = locationDOM.length > 0 ? locationDOM.text() : '';

        const craigListJob = {
          from: "Craiglist",
          time,
          jobTitle,
          link,
          location
        };
        arrayOfJobList.push(craigListJob);
      });
      resolve(arrayOfJobList);
    });
  });
};


