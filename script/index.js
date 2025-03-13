// showloader...
const showloader = () => {
    document.getElementById("loader").classList.remove("hidden");
    document.getElementById("video-container").classList.add("hidden");
}

const hideloader = () => {
    document.getElementById("loader").classList.add("hidden");
    document.getElementById("video-container").classList.remove("hidden");
}

function removeActiveClass(){
    const activeButtons = document.getElementsByClassName("active");
    for(let btn of activeButtons){
        btn.classList.remove("active");
    }
    //console.log(activeButtons);
}

function loadCategories(){
    // 1- fetch the data
    fetch('https://openapi.programming-hero.com/api/phero-tube/categories')
    // 2- convert promise to json
    .then(res => res.json())
    // 3- send data to display
    .then(data => displayCategories(data.categories))
}

function displayCategories(categories){
    // get the container
    const categoryContainer = document.getElementById('category-container');
    // Loop operation on Array of object
    for(let cat of categories){
        //console.log(cat)
        // create Element
        const categoryDiv = document.createElement("div");
        categoryDiv.innerHTML = `
            <button id="btn-${cat.category_id}" onclick="loadCategoryvideos(${cat.category_id})" class="btn btn-sm hover:bg-red-500 hover:text-white rounded py-2 px-5 font-medium bg-[#25252515] border-none">${cat.category} </button>
        `
        // Append the Element
        categoryContainer.appendChild(categoryDiv);
    }
}

loadCategories()

// call to displayVideos...
const loadCategoryvideos = (id) => {
    showloader();
    console.log(id);
    const url = `https://openapi.programming-hero.com/api/phero-tube/category/${id}`;
    //console.log(url);
    fetch(url)
        .then(res => res.json())
        .then(data => {
            removeActiveClass(); 
            // no active class
            const clickedButton = document.getElementById(`btn-${id}`);

            clickedButton.classList.add("active");
            displayVideos(data.category);
        })
};

function loadVideos(searchText = "") {
    showloader();

    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
        .then(res => res.json())
        .then(data => {
            removeActiveClass();
            document.getElementById("btn-all").classList.add("active");
            displayVideos(data.videos)
        })
}

const displayVideos = (videos) => {
    //console.log(videos);
    const videoContainer = document.getElementById("video-container");
    videoContainer.innerHTML = " ";

    if (videos.length == 0){
        videoContainer.innerHTML = `
        <div class="col-span-full text-center flex flex-col justify-center items-center mt-20">
            <img src="assets/Icon.png" alt="">
            <h1 class="font-bold text-2xl text-[#171717] leading-10">Oops!! Sorry, There is no <br> content here</h1>
        </div>
        `
        hideloader();
        return;
    }

    videos.forEach((video) => {
        // console.log(video)
        const videoCard = document.createElement("div");
        videoCard.innerHTML = `
        <div class="card">
            <figure class="relative mb-5">
                <img class="rounded-lg w-full h-[200px] object-cover" src="${video.thumbnail}" alt="Shoes" />
                <span class="absolute text-white bg-black p-1 bottom-3 right-3 text-[10px] rounded">3hrs 56 min ago</span>
            </figure>

            <div class="flex gap-3">
                <div class="avatar">
                    <div class="w-10 h-10 rounded-full">
                        <img src="${video.authors[0].profile_picture}" />
                    </div>
                </div>
                <div>
                    <h2 class="card-title">${video.title}</h2>
                    <p class="text-sm text-[#17171770] flex gap-2">${video.authors[0].profile_name}
                        ${video.authors[0].verified == true ? `<img src="assets/Group.png" alt="">`: ` `}
                    </p>
                    <p class="text-sm text-[#17171770]">${video.others.views} views</p>
                </div>
            </div>
            <button onclick=loadVideoDetails('${video.video_id}') class="btn mt-4">Show Details</button>
        </div>
        `;
        videoContainer.appendChild(videoCard);
        hideloader();
    })
}

loadVideos()

const loadVideoDetails = (videoId) => {
    const url = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
    fetch(url)
    .then(res => res.json())
    .then(data => displayVideoDetails(data.video));
};

const displayVideoDetails=(video) => {
    console.log(video)
    document.getElementById("videoDetails").showModal();
    const detailsContainer = document.getElementById("details-container");
    detailsContainer.innerHTML = `
        <div class="card image-full ">
  <figure>
    <img
      src="${video.thumbnail}" />
  </figure>
  <div class="card-body">
    <h2 class="card-title">${video.title}</h2>
    <p>${video.description}</p>
    
  </div>
</div>
    `
};

// input

document.getElementById("search-input").addEventListener("keyup",
    (e) => {
        const input = e.target.value;
        loadVideos(input);
    }
)




