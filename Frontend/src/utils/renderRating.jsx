const renderRating = (rating) => {
    const roundedRating = Math.round(rating * 2) / 2;
    const fullStars = Math.floor(roundedRating);
    const hasHalfStar = roundedRating % 1 !== 0;
    const stars = [];

    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars.push(<span key={i} className="text-yellow-400">★</span>);
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars.push(<span key={i} className="relative"><span className="text-yellow-400" style={{ position: 'absolute', width: '50%', overflow: 'hidden' }}>★</span><span className="text-gray-300">★</span></span>);
        } else {
            stars.push(<span key={i} className="text-gray-300">★</span>);
        }
    }
    return stars;
};

export default renderRating;