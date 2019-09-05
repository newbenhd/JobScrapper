$(document).ready(function() {
  craigListFetch('software').then((jobs)=>{
    for(const job of jobs) {
      const cardDOM = $(`<div class="card"><div class="title"><a href="${job.link}" class="link">${job.jobTitle}</a></div><div class="location">${job.location}</div><div class="select"><button class="select-btn">Add</button></div></div>`)
      $('#craiglist-list').append(cardDOM);
    }
  });
  indeedFetch('default for now').then(jobs=>{
    for(const job of jobs) {
      const cardDOM = $(`<div class="card"><div class="title"><a href="${job.link}" class="link">${job.jobTitle}</a></div><div class="location">${job.location}</div><div class="select"><button class="select-btn">Add</button></div></div>`)
      $('#indeed-list').append(cardDOM);
    }
  });
  $('#bookmark-toggle').on('click',function(){
    $('#bookmark-list').toggle("blind", 200);
  });
  $('#indeed-toggle').on('click',function(){
    $('#indeed-list').toggle("blind", 200);
  });
  $('#craiglist-toggle').on('click',function(){
    $('#craiglist-list').toggle("blind", 200);
  });
});

const indeedFetch = (query) => {
  return new Promise((resolve, reject) => {
    const arrayOfJobList = [];
    $.get('https://www.indeed.com/jobs?q=react&l=Los+Angeles', function(data){
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







const getUsingFetch = url => {
  fetch(url).then(response=>{
    return response.text();
  }).then(htmlString => {
    console.log(htmlString);
  });
};
