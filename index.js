const BASE_URL ='https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

function renderMovieList(data){
    let rawHTML = ''
    data.forEach((item) => {
        // console.log(item)
        //title, image
        rawHTML += `
            <div class="col-sm-3">
                <div class="mb-2">
                    <div class="card">
                        <img src="${POSTER_URL}${item.image}"
                            class="card-img-top" alt="Movie Poster" />
                        <div class="card-body">
                            <h5 class="card-title">${item.title}</h5>
                        </div>
                        <div class="card-footer">
                            <button class="btn btn-primary btn-show-movie" data-toggle="modal"
                                data-target="#movie-modal" data-id="${item.id}">More
                            </button>
                            <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
                        </div>
                    </div>
                </div>
            </div>
        `
    })
    dataPanel.innerHTML = rawHTML
}

function showMovieModel(id){
    const modalTitle = document.querySelector('#movie-modal-title')
    const modalImage = document.querySelector('#movie-modal-image')
    const modalDate = document.querySelector('#movie-modal-date')
    const modalDescp = document.querySelector('#movie-modal-description')
    axios
    .get(INDEX_URL + id)
    .then((response) => {
        const data = response.data.results
        modalTitle.innerText = data.title
        modalDate.innerText = data.release_date
        modalDescp.innerText = data.description
        modalImage.innerHTML = `<img src="${
            POSTER_URL + data.image
        }" alt="movie-poster" class="img-fluid">`
    })
}


const movies = []
axios
.get(INDEX_URL)
.then((response) => {
    //array(80)

    // for(const movie of response.data.results){
    //     movies.push(movie)
    // }
    movies.push(...response.data.results)
    // console.log(movies)
    renderMovieList(movies)
})
.catch((err) => console.log(err))


// function addToFavorite(id){
//   console.log(id)
// }
function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)
//   console.log(movie)
  if (list.some((movie) => movie.id === id)) {
    return alert('此電影已經在收藏清單中！')
  }
  list.push(movie)
  console.log(list)

  localStorage.setItem('favoriteMovies', JSON.stringify(list))
//   console.log(id)
}

dataPanel.addEventListener('click',function onPanelClicked(event){
    if(event.target.matches('.btn-show-movie')){
        // console.log(event.target.dataset.id)
        showMovieModel(Number(event.target.dataset.id))
    } else if (event.target.matches('.btn-add-favorite')) {
        // console.log(event.target.dataset.id)
        addToFavorite(Number(event.target.dataset.id))
    }
})


searchForm.addEventListener('submit',function onSearchFormSubmitted(event){
    event.preventDefault()
    console.log('click!')
    console.log(searchInput.value)

     //取得搜尋關鍵字
    const keyword = searchInput.value.trim().toLowerCase()

    // console.log(keyword)

    //儲存符合篩選條件的項目
    let filteredMovies = []      //存放搜尋完的結果
        //錯誤處理：輸入無效字串
        // if(!keyword.length){
        //     alert('請輸入有效字串！')
        // }

      //條件篩選
    filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(keyword))
    if(filteredMovies.length === 0){
        alert(`您輸入的關鍵字：${keyword}沒有符合條件的電影`)
    }
      //重新輸出至畫面
    renderMovieList(filteredMovies)

})