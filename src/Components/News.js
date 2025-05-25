import React, { useEffect, useState } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';

const News = ({ country = 'us', pageSize = 8, category = 'general', setProgress }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    document.title = `${capitalizeFirstLetter(category)} - NewsMonkey`;
    fetchNews();
    // eslint-disable-next-line
  }, []);

  const fetchNews = async () => {
    setProgress(20);
    const apiKey = process.env.REACT_APP_NEWS_API_KEY;
    const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`;

    setLoading(true);

    try {
      const response = await fetch(url);
      const parsedData = await response.json();
      setProgress(70);

      if (parsedData.status !== 'ok') {
        console.error('API Error:', parsedData);
        setLoading(false);
        setHasMore(false);
        setProgress(100);
        return;
      }

      setArticles(parsedData.articles);
      setTotalResults(parsedData.totalResults);
      setLoading(false);
      setHasMore((page * pageSize) < parsedData.totalResults);
      setProgress(100);
    } catch (error) {
      console.error('Error fetching news:', error);
      setLoading(false);
      setHasMore(false);
      setProgress(100);
    }
  };

  const fetchMoreData = async () => {
    const nextPage = page + 1;
    const apiKey = process.env.REACT_APP_NEWS_API_KEY;
    const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}&page=${nextPage}&pageSize=${pageSize}`;

    try {
      const response = await fetch(url);
      const parsedData = await response.json();

      if (parsedData.status !== 'ok') {
        console.error('API Error (More Data):', parsedData);
        setHasMore(false);
        return;
      }

      setArticles((prevArticles) => prevArticles.concat(parsedData.articles));
      setTotalResults(parsedData.totalResults);
      setPage(nextPage);
      setHasMore((nextPage * pageSize) < parsedData.totalResults);
    } catch (error) {
      console.error('Error fetching more data:', error);
      setHasMore(false);
    }
  };

  return (
    <div className="container-fluid my-3" style={{ overflowX: 'hidden' }}>
      <h1 className="text-center" style={{ margin: '35px 0px',marginTop:'90px' }}>
        NewsMonkey - Top Headlines - {capitalizeFirstLetter(category)}
      </h1>

      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<Spinner />}
        endMessage={
          <p style={{ textAlign: 'center', marginTop: '20px', fontWeight: '500' }}>
            <b>You have seen all the news 🎉</b>
          </p>
        }
      >
        <div className="container">
          <div className="row">
            {articles.map((element) => (
              <div className="col-md-4" key={element.url}>
                <NewsItem
                  title={element.title ? element.title.slice(0, 45) : ''}
                  description={element.description ? element.description.slice(0, 88) : ''}
                  imageUrl={element.urlToImage}
                  newsUrl={element.url}
                  author={element.author}
                  date={element.publishedAt}
                  source={element.source.name}
                />
              </div>
            ))}
          </div>
        </div>
      </InfiniteScroll>
    </div>
  );
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
  setProgress: PropTypes.func.isRequired,
};

export default News;
