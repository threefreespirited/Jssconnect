var blogData = [
       {
           "date": `12-Sept-2020`,
           "title": `What to do when entering a college?`,
           "authorPortfolio": `https://heysujal.github.io/portfolio/`,
           "authorImg":`https://avatars2.githubusercontent.com/u/55016909?s=460&u=14884ea015783d7247d9791120475ccd799d3963&v=4`,
           "authorName": `Sujal Gupta`,
           "contentImg": `https://static.vecteezy.com/system/resources/previews/000/464/809/non_2x/vector-businessman-confuse-between-pile-of-books.jpg`,
           "content": `One of the biggest question that actually confuses our freshers is
        what should do they do <strong>first?</strong>

        <br>
        <br>

        A lot of students, are confused when they enter college for the first time. They are not clear about what course
        to do? What language should they learn first and most of the times they end up wasting time doing nothing.
        <br>
        <br>
        Should they learn a programming language? If yes, then which one C or C++, python or Java.
        <br>
        <br>
        Should I do competitive programming? Is it important?
        <br>
        <br>
        Should I start doing machine learning projects because it's in trend?
        <br>
        <br>
        How and When should I start to prepare for the college internal exams? Should I devote daily some time to my
        subjects or try to cover everything up just before one week of the exam?
        <br>
        In this blog you are going to get all the answers to these questions and I want to give more emphasis that you
        should be spending more time doing things rather than just reading about them. In simple words take action. Do
        things and don’t forget to enjoy the journey as well.
        <br>
        So now we will answer all the questions one by one
        <br>
        <br>
        <strong> <strong>What programming language should I learn first? And why?</strong> </strong>
        <br>
        <br>
        This question has a very simple answer but you can easily find people make it a big deal.
        <br>
        Since this blog is to save your precious time, we will avoid any of the useless advices and I will suggest you
        to start learning C++.It has a lot of advantages to it and more than 80% of students use it in competitive
        programming.
        <br>
        <br>
        <strong> What should I start learning when I first enter college?</strong>
        <br>
        <br>
        I would highly recommend you to learn Web Development.
        <br>
        It is easy to get started with and if you start early on and do it on a daily basis then you can easily become a
        master at it which opens door for various opportunities.
        <br>
        You can also checkout these free resources to learn web development for free.
        <br>
        <br>
        <strong> What is the basic roadmap of my 4 years in college life?</strong>
        <br>
        <br>
        Well, there is no specific path to it. But what I have observed so far this is what you should be learning
        typically
        <br>
        <br>
        <strong>Learn web development</strong> – Through this you will get a hang of using a programming language.
        <br>
        <br>
        <strong>Learn C++ programming</strong> – Learn basic syntax to print and loops, conditional statements etc.
        <br>
        <br>
        To get used to C++ language.
        <br>
        <br>
        <strong>Competitive Coding</strong>-Once you are familiar with the language, you can now start taking part in
        online coding competition right
        away on platforms like hackerrank , codechef or codeforces etc,
        <br>
        <br>
        <a href="https://www.w3schools.com">Read More.</a>
         Which competitive programming platform is the best to practice?
        <br>
        <br>
        <strong>Learn Data Structures and Algorithms</strong> –They are very important for your placements as well as in
        competitive
        programming. Any big firm will ask you question on this, so you must give and prepare it well.
        <br>
        <br>
        <strong>Practice Practice Practice</strong>- Once you are done with learning DSA you should now give a good time
        in improving your problem solving and
        try to master DSA. Take Part in online competitions etc.
        <br>
        <br>
        <strong>Machine learning</strong>- Now you have done most of the part and you should now start learning data
        science or machine learning.
        <br>
        <br>
        See this is not a fixed order but this I what I would suggest you to follow if you wish to make a good use of
        your time and also don’t want to leave any stone untouched.
        <br>
        <br>
        You can always message us regarding any query or doubt using the contact form <a href="/contact" style="color: #2c7873;">here</a> .`
    },
    {
        
            "date": `13-Sept-2020`,
            "title": ` A Glimpse to 'Asynchronous JavaScript'`,
            "authorPortfolio": `https://devwebaman.netlify.app/`,
            "authorImg":`https://media-exp1.licdn.com/dms/image/C5603AQHG2HBfNZ1PWw/profile-displayphoto-shrink_200_200/0?e=1605744000&v=beta&t=iKjQsNKs4vZzZkS4I6y8qF215YHiGS5CvtV38YWGSZk`,
            "authorName": `Aman Dixit`,
            "contentImg": `https://wallpapercave.com/wp/wp2465898.png`,
            "content": `Asynchronous and Synchronous are one of the few most popular and most confusing JavaScript Words.
            Especially for beginners these words are like an untold story.
            Javascript is a <strong>single-threaded</strong> programming language, <br><br>
            <strong style="color:black">Ques.</strong>What is the reason behind calling JavaScript as a single-threaded Programming
            Language?<br>
            <strong style="color:black">Ans.</strong>&nbsp;&nbsp;&nbsp;It means that in JavaScript only one task can execute at a point of time.
            But there are situations when we want to execute more than one
            tasks at a time then at time <strong>Asynchronous Javascript</strong> comes into the picture.<br><br>
            Let's look at a simple example<br><br>
            
            
            <strong style="color:black;font-size:1.3rem;">
            const btn=<br>document.querySelector('btn);<br>
            
            btn.addEventListener('click', () => {<br>
          
            alert('You clicked me!');<br>
    
            
            let pElem = document.createElement('p');<br>
           
            p.textContent = 'This is a newly-added paragraph.';<br>
           
            document.body.appendChild(p);<br>
          
            });<br><br></strong>
    
            In the above example we grab a reference to a
            <strong>button</strong> element that is already available in the DOM.<br>
            We add a click event listener to it so that when the
            button is clicked:<br>
           1.An alert() message appears.<br>
               2.Once the alert is dismissed, we create a
            element.<br>
            3.We then give it some text content.<br>
             4.Finally, we append the paragraph to the document
            body.<br><br>
            Here as long as one operation is processed, nothing else can process.This is because as we have earlier read
            that
            JavaScript is a single threaded language which mean that only one thing can happen at a time.
            So in the example above, after you've clicked the button the paragraph won't appear until after the
            OK button is pressed in the alert box<br>
            <br>
            Here<strong> Asynchronous JasvaScript</strong> comes to rescue.It enables us to overcome this limation of JavaScript being 
            single-threaded.<br>
            There are two main types of asynchronous code style you'll come across in JavaScript code, old-style callbacks
            and newer promise-style code.<br>
            Here I will be taking you through newer style of <strong>asynchronous code</strong>:<br><br>
            <strong style="font-size:2rem"> 1.Promises</strong><br><br>
            Promises are the new style of async code that you'll see used in modern Web APIs. 
            A good example is the fetch() API, which is basically like a modern, more efficient version of
            XMLHttpRequest.<br>
            Let's Look at a example to understand the concept of asynchronous<br><br>
    
          <strong style="color:black;font-size:1.4rem;">
             fetch("url")<br>
            
            .then((response)=>{<br>
                return response.json();<br>
                
            })<br>
               .then((data)=>{<br>
                    console.log(data)<br>
                  
                    console.log("Promise is returned")})<br>
                  
                    console.log("Promise is being processed");<br></strong><br><br>
    
           <strong> Output:Promise is being processed; Promise is returned<br></strong><br><br>
                    
    
            Here we see fetch() taking a single parameter — the URL of a resource you want to fetch from the network>
            — and returning a promise. The promise is an object representing the completion or failure of the async
            operation. <br>
            It represents an intermediate state, as it were. In essence, it's the browser's way of saying "I promise to get
            back to you
            with the answer as soon as I can," hence the name "promise." by the time this promise is being returned code
            execution 
            skips the fetch block and execute the code after the fetch() block, which you can understand from the above
            example output<br><br>
            We've then got three further code blocks chained onto the end of the fetch():<br>
            1.Two then() blocks. Both contain a callback function that will run if the previous operation is successful, and
            each callback
            >receives as input the result of the previous successful operation, so you can go forward and do something
            else to it.<br>
            2.Each .then() block returns another promise, meaning that you can chain multiple .then() blocks onto each other,
            so multiple asynchronous operations can be made to run in order, one after another.<br>
            3.The catch() block at the end runs if any of the .then() blocks fail <br>
    
    
    
    `
     },
     {
        
        "date": `21-Sept-2020`,
        "title": `  'Asynchronous JavaScript(2nd Part)'`,
        "authorPortfolio": `https://devwebaman.netlify.app/`,
        "authorImg":`https://media-exp1.licdn.com/dms/image/C5603AQHG2HBfNZ1PWw/profile-displayphoto-shrink_200_200/0?e=1605744000&v=beta&t=iKjQsNKs4vZzZkS4I6y8qF215YHiGS5CvtV38YWGSZk`,
        "authorName": `Aman Dixit`,
        "contentImg": `https://wallpapercave.com/wp/wp2465898.png`,
        "content": ` This is the second blog of series of Asynchronous JavaScript, 
        if you haven't gone through first blog I suggest you to go through it first before this blog for better
        understanding purpose,I have provided the link at bottom to the first blog of this series.
        <br><br>
        So,in the first blog of Asynchronous series I talked about various key aspects related to Asynchronous 
        Javascript, in today's blog I had explained the second method of implementing <strong>'Asynchronous Javascript'</strong>
        <br><br>
        <strong>Async/Await</strong><br>
        You might be thinking what are the two words that I am talking about,no need to worry just go through the blog I have explained these in detail<br>
       <br><strong>Ques.</strong>What actually are these two keywords(Async/Await)?<br>
        <strong>Ans.</strong> Actually async and await  are two keywords that enable asynchronous, promise-based behavior to be written in a cleaner style, avoiding the need to explicitly configure promise chains.
     <br>Let's begin with an example<br>
      <br>
        async function cricapi(){ <br>
            const url="https://cricapi.com/api/playerStats"; <br>
            const res = await fetch(url); <br>
            const data = await res.json(); <br>
            console.log("after execution"); <br>
        } <br>
        crickapi();<br>
        console.log("before execution of async function");<br><br>
 
        <strong>Output:</strong><br>
        Before execution of async function<br>
        After execution of async function completed<br><br>
        <strong>Explaination:</strong><br>
        Async function waits for execution of await blocks untill they are executing, the control skips to the next line
        so, I feel you might have understood the example.<br><br>
        Async functions can contain zero or more await expressions. Await expressions pause the execution across 
         async function, yielding control and subsequently resuming progress only when an awaited promise-based 
         asynchronous operation is either fulfilled or rejected. The resolved value of the promise is treated as 
         the return value of the await expression. Use of async / await enables the use of ordinary
          try / catch blocks around asynchronous code.<br><br>
          Async functions always return a promise. If the return value of an
           async function is not explicitly a promise, it will be implicitly wrapped in a promise.<br><br>
 
          <strong>Key Points:</strong><br>
          1.The await keyword is only valid inside async functions. 
          If you use it outside of an async function's body, you will get a <strong>SyntaxError.</strong><br>
          2.The purpose of async/await is to simplify the syntax necessary to consume promise-based APIs.
          The behavior of async/await is similar to combining generators and promises.<br><br>
         So, this is it in this blog of Asynchronous Series.<br>
         Don't forget to give feedback about this blog and you can give suggestion about the topics on which you want blogs to be written.<br>
         *First Blog of this series 👉 <a href="/blogs">Asynchronous(1)</a><br>
         *Link to feedback page 👉 <a href="/feedback">Feedback</a>`
 },
 {
    "date": `21-Sept-2020`,
    "title": `  'Competitive Programming'`,
    "authorPortfolio": `https://devwebaman.netlify.app/`,
    "authorImg":`https://media-exp1.licdn.com/dms/image/C5603AQHG2HBfNZ1PWw/profile-displayphoto-shrink_200_200/0?e=1605744000&v=beta&t=iKjQsNKs4vZzZkS4I6y8qF215YHiGS5CvtV38YWGSZk`,
    "authorName": `Aman Dixit`,
    "contentImg": `https://cdn.pixabay.com/photo/2017/07/31/11/31/laptop-2557468__340.jpg`,
    "content": ` In this blog I will be giving answers to basically two questions related to <strong>Competitive Programming</strong> which every beginners find difficult to get answers<br>
    <br><strong>Q1:</strong>What is competitive programming?<br>
    <strong>Q2:</strong>How to start competitive programming as a beginner?<br><br>
    So, if you are a beginner and want to enter the arena of <strong>CP</strong> then you will surely find this blog useful.<br>
    As a coder, you should not be limited with just reading and coding on your computer. 
    For developing  and enhancing your coding skills, you need to test yourself.
    So,basically <strong>CP</strong> provides you this oppurtunity to test yourself with others and see where you are standing
    You need to take yourself outside your comfort zone and evaluate how you perform. 
    That’s what different coding competitions do for you.
     As you compete in several coding competitions you get a feel coding under pressure. Plus, it will push you to execute shorter 
     and quicker codes, enhance your problem-solving skills and make you a much better coder than before.You get a chance to meet other coders who are at the top and you admire to become like them.
     So,basically CP gives you all ranging from exposure and experience to motivation.
     <br><br>
     But, for beginner it is difficult to know about how to start <strong>CP</strong> and what are the resources that are helpful
     So, below are the top resources and platforms for practicing and developing your competitive skills along with the below mentioned one there are other resources too I have only listed few of them:<br>
     <br>
     <strong>Top Platforms:</strong><br>
     1.Code Chef<br>
     2.Code Forces<br>
     3.Hacker Rank<br>
     4.Hacker Earth<br>
     So,these are few of the Competitive Programming Arenas where contest are organized regularly along with
     contest there are practice questions and tutorials which help in developing and testing your CP skills.
    <br>
    <strong>Top Tools:</strong><br>
    During programming contests, you can use a number of tools to debug a problem or highlight a problem. 
    These are a few tools that can be really helpful for you:<br>
    1.Online Ides like <strong>Ideone,Code Chef,CSAcademy Ide</strong><br>
    2.Difference Checker like <strong>CSAcademy Ide</strong>
    <br>
    So,If you are new to Compettive Programming are want to start it,just be consistent and patience as 
    there might be some situations where the results will not go your side but keep in mind that CP 
    is not one night thing, for being successful in CP you should be hardworking,consistent and patient as it takes months even years 
    for excelling in CP skills.So don't worry and just be consistent and hardworking,results will start coming...
    <br>Wishing you <em>Best of Luck</em>.<br>
    
     `
 }

    
]

let date = document.getElementById("date");
let title = document.getElementById("title");
let authorPortfolio = document.getElementById("authorPortfolio");
let authorImg = document.getElementById("authorImg");
let authorName = document.getElementById("authorName");
let contentImg = document.getElementById("contentImg");
let content = document.getElementById("content");

let readAttribute = Number(localStorage.getItem("readAttribute"));

myBlogs(readAttribute-1);

function myBlogs(i){
// for(var i=0; i<blogData.length; i++){
    date.innerHTML = blogData[i].date;
    title.innerHTML = blogData[i].title;
    authorPortfolio.setAttribute("href", blogData[i].authorPortfolio);
    authorImg.setAttribute("src", blogData[i].authorImg);
    authorName.innerHTML = blogData[i].authorName;
    contentImg.setAttribute("src", blogData[i].contentImg);
    content.innerHTML = blogData[i].content;       
}





