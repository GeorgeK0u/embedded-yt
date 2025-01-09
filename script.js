let searchInput, searchBtn, videoResults, clickedVideo, video, videoWrapper, videoTitle, videoThumbnail, loadMoreResultsBtn;
let maxResults, videoCount, i;
let searchQuery, apiKey, nextPageToken;
let firstSearch;

function GetElById(id)
{
    return document.getElementById(id);
}
function CreateEl(elType)
{
    return document.createElement(elType);
}
function Init()
{
    searchInput = GetElById("search-input");
	// Perform search when enter gets pressed inside search input
	searchInput.onkeyup = (key) => 
		{
			let keyCode = key.key;
			if (keyCode != 'Enter')
			{
				return;
			}
			Search();
		}
    searchBtn = GetElById("search-btn");
    searchBtn.addEventListener("click", Search);
    clickedVideo = GetElById("clicked-video");
    clickedVideo.style.display = "none";
    videoResults = GetElById("video-results");
    loadMoreResultsBtn = GetElById("more-results-btn");
    loadMoreResultsBtn.addEventListener("click", GetResults);
    loadMoreResultsBtn.style.display = "none";
    maxResults = 10;
    apiKey = "AIzaSyCHhXjOCJqs2FX58P_qhO9XGBZcWBMvMlk";
    firstSearch = true;
}
function Search()
{
    searchQuery = searchInput.value;
    if (searchQuery == "")
    {
        return;
    }
    nextPageToken = "";
    // Remove previous results
    for (i = videoResults.children.length - 1; i >= 0; i--)
    {
        videoResults.children[i].remove();
    }
    GetResults();
}
function GetResults()
{
    fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&maxResults=${maxResults}&key=${apiKey}&pageToken=${nextPageToken}`)
    .then(response => response.json())
    .then(function(results)
    {
		// Error occured
		if (results.error)
		{
			throw new Error(results.error.message);
		}
		// Show results
        nextPageToken = results.nextPageToken;
        ShowResults(results);
    })
    .catch(function(err)
    {
        alert(err);
        console.log(err);
    });
}
function ShowResults(results)
{
    videoCount = results.items.length;
    for (i = 0; i < videoCount; i++)
    {
        video = results.items[i];
        // Title
        videoTitle = CreateEl("b");
        videoTitle.textContent = video.snippet.title;
        // Thumbnail
        videoThumbnail = CreateEl("img");
        videoThumbnail.style.display = "block";
        videoThumbnail.src = video.snippet.thumbnails.high.url;
        videoThumbnail.width = video.snippet.thumbnails.high.width;
        videoThumbnail.height = video.snippet.thumbnails.high.height;
        // Wrapper
        videoWrapper = CreateEl("a");
        videoWrapper.id = "video-result-wrapper";
        videoWrapper.href = "#top";
        videoWrapper.title = `https://www.youtube.com/embed/${video.id.videoId}`;
        videoWrapper.addEventListener("click", function(e)
        {
            if (clickedVideo.style.display == "none")
            {
                clickedVideo.style.display = "block";
            }
            clickedVideo.src = e.target.parentElement.title;
        });
        videoWrapper.appendChild(videoTitle);
        videoWrapper.appendChild(videoThumbnail);
        videoResults.appendChild(videoWrapper);
    }
    // Show more results btn
    if (!firstSearch)
    {
        return;
    }
    loadMoreResultsBtn.style.display = "inline-block";
    firstSearch = false;
}
Init();
