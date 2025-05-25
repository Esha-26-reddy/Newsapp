import React, { useState } from 'react';

const NewsItem = (props) => {
  const [imgError, setImgError] = useState(false);

  const handleImageError = () => {
    setImgError(true);
  };

  const { title, description, imageUrl, newsUrl, author, date, source } = props;

  const fallbackImage =
    "https://www.washingtonpost.com/wp-apps/imrs.php?src=https://podcast.posttv.com/series/20250520/t_1747770805330_name_6DYPHD54YLYK4TDI3HPAPNDFB4.jpg&w=1440";

  return (
    <div className="my-3">
      <div className="card" style={{ position: 'relative' }}>
        {/* Source badge */}
        <span
          className="position-absolute badge rounded-pill bg-danger"
          style={{zIndex: 1, right: '10px', top: '10px' }}
        >
          {source}
        </span>

        <img
          src={imgError || !imageUrl ? fallbackImage : imageUrl}
          className="card-img-top"
          alt="news"
          onError={handleImageError}
        />
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{description}</p>
          <p className="card-text">
            <small className="text-muted">
              By {!author ? 'Unknown' : author} on {new Date(date).toGMTString()}
            </small>
          </p>
          <a
            href={newsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-danger"
          >
            Read more
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsItem;
