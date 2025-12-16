
import React, { useState, useEffect } from "react";
import classes from "./Gallery.module.css";
import basewebURL from "../../basewebURL";

const Gallery = (props) => {
    const [items, setItems] = useState([]);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        props.passMountInfo(true);
        return () => {
            props.passMountInfo(false);
        };
    }, [props]);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const response = await fetch(`${basewebURL}/api/gallery/`);
                const data = await response.json();
                setItems(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching gallery:", error);
                setLoading(false);
            }
        };
        fetchGallery();
    }, []);

    const filteredItems =
        filter === "all"
            ? items
            : items.filter((item) => item.category === filter);

    const categories = ["all", "office", "events", "celebration", "others"];

    return (
        <div className={classes.galleryContainer}>
            <div className={classes.galleryCheck}>
                <div className={classes.galleryHeader}>
                    <h1>Our Gallery</h1>
                    <div className={classes.underline}></div>
                    <p>Explore our latest events, office culture, and celebrations.</p>
                </div>

                <div className={classes.filterContainer}>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className={`${classes.filterButton} ${filter === cat ? classes.activeFilter : ""
                                }`}
                            onClick={() => setFilter(cat)}
                        >
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className={classes.loader}>Loading...</div>
                ) : (
                    <div className={classes.galleryGrid}>
                        {filteredItems.map((item) => (
                            <div key={item.id} className={classes.galleryItem}>
                                <div className={classes.imageWrapper}>
                                    <img
                                        src={item.image.startsWith("http") ? item.image : `${basewebURL}${item.image}`}
                                        alt={item.title}
                                        className={classes.galleryImage}
                                    />
                                    <div className={classes.overlay}>
                                        <div className={classes.overlayContent}>
                                            <h3>{item.title}</h3>
                                            <p>{item.description}</p>
                                            <span className={classes.categoryTag}>{item.category}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Gallery;
