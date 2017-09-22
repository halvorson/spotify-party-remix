import axios from "axios";

// Export an object containing methods we'll use for accessing the Dog.Ceo API

export default {
	getArticles: function(query) {
		query['api-key'] = '9e893f8545284a63935161488bb0884b';
		//var apiKey = "api-key=9e893f8545284a63935161488bb0884b";
		//var urlQuery = "https://api.nytimes.com/svc/search/v2/articlesearch.json" + "?q=" + searchTitle + "?begin_date=" + startYear + "?end_date=" + endYear "?" + apiKey;
		var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
		return axios.get(url, { params: query});
	},
	getSavedArticles: function() {
		return axios.get("/api/articles/");
	},
	getSavedArticle: function(id) {
		return axios.get("/api/articles/" + id);
	},
	deleteSavedArticle: function(id) {
		return axios.delete("/api/articles/" + id);
	},
	saveArticle: function(articleData) {
		return axios.post("/api/articles", articleData);
	}
};

