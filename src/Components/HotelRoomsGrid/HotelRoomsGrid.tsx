import { useState } from "react";
import styles from "./HotelRoomsGrid.module.css";
import Displayroom1 from "../../assets/Displayroom 1.jpg";
import Displayroom2 from "../../assets/Displayroom 2.jpg";
import Displayroom3 from "../../assets/Displayroom 3.jpg";
import Displayroom4 from "../../assets/Displayroom 4.jpg";
import Displayroom5 from "../../assets/Displayroom 5.jpg";
import Displayroom6 from "../../assets/Displayroom 6.jpg";
import Displayroom7 from "../../assets/Displayroom 7.jpg";
import Displayroom8 from "../../assets/Displayroom 8.webp";
import Displayroom9 from "../../assets/Displayroom 9.jpg";

const AMENITY_BADGE = ({ text }: { text: string }) => (
  <svg width="107" height="50" viewBox="0 0 107 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M25 0.5H82C95.531 0.5 106.5 11.469 106.5 25C106.5 38.531 95.531 49.5 82 49.5H25C11.469 49.5 0.5 38.531 0.5 25C0.5 11.469 11.469 0.5 25 0.5Z" fill="white" stroke="black"/>
    <text x="53.5" y="28" textAnchor="middle" fill="black" fontSize="12" fontWeight="500">
      {text}
    </text>
  </svg>
);

const ROOM_BADGE = ({ bedrooms, bathrooms, guests }: { bedrooms: number, bathrooms: number, guests: number }) => (
  <div style={{ 
    width: '100%',
    maxWidth: '240px',
    height: '28px',
    background: 'white',
    border: '1px solid black',
    borderRadius: '15px',
    display: 'flex',
    alignItems: 'center',
    padding: '3px 10px',
    gap: '15px'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px' }}>
      <div style={{ width: '16px', height: '16px' }}>{BEDROOM_SVG}</div>
      <span style={{ fontWeight: '600' }}>{bedrooms}</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px' }}>
      <div style={{ width: '16px', height: '16px' }}>{BATHROOM_SVG}</div>
      <span style={{ fontWeight: '600' }}>{bathrooms}</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px' }}>
      <div style={{ width: '16px', height: '16px' }}>{GUEST_SVG}</div>
      <span style={{ fontWeight: '600' }}>{guests}</span>
    </div>
  </div>
);

const BATHROOM_SVG = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
    <rect width="24" height="24" fill="url(#pattern0_44_379)"/>
    <defs>
      <pattern id="pattern0_44_379" patternContentUnits="objectBoundingBox" width="1" height="1">
        <use xlinkHref="#image0_44_379" transform="scale(0.0078125)"/>
      </pattern>
      <image id="image0_44_379" width="128" height="128" preserveAspectRatio="none" xlinkHref="data:image/png;base64,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"/>
    </defs>
  </svg>
);

const BEDROOM_SVG = (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
    <rect width="26" height="26" fill="url(#pattern0_44_381)"/>
    <defs>
      <pattern id="pattern0_44_381" patternContentUnits="objectBoundingBox" width="1" height="1">
        <use xlinkHref="#image0_44_381" transform="scale(0.0078125)"/>
      </pattern>
      <image id="image0_44_381" width="128" height="128" preserveAspectRatio="none" xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAADsQAAA7EB9YPtSQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAlnSURBVHic7Z17jBXVGcB/u+sCK7qCGBCKSmt5iCZd7UOqYlQMNT7bKkKNNj4S0Wj6ikltU03qH74SFaMrGq1FTKWNmtZWaMXXIpWAiI2P+pYsYtXWysMubNmyS//4Zjzn7p1753Vm5j6+XzLZs3fO45u535w55zvf+S4oiqIoiqIoiqIoiqIoiqIoiqIoiqIoiqIoiqIoiqIoilLftBQtgMJY4ETgS0BblXw7gFeA1cCeHORScuBcYAvyhUY91gFfKEJYxS2zgAHiffn+8Teg1YUQe7moREnET4B2YAj4MfB8SP524BrgVKALOAVYkaWASna0AtuQp/nZGOWmYHqBO1wJouTPTGA/L706Rrle4AMvfbQLQVQBimGWlV4Xs+xa730vrpdXG/70BDzXEfKcqvfAR5BPB/6gSaOAkbQxEqKIRJBJKPHVTHr7/tqpvt6kvC5QDczs+2iUX4Yn1NJJVhsAPpCWoFPu2H7vZ/i3yRO1u87UAiEEQ3yLnVcwYzMEVYBitEIgGjVP4b1t0Aj1T/KqzR7OjO1+NBpTM3nxwnHD8VuXxMv1HY8AdmNnqLktxl8BH5dxnYgIgFUCY8j/5zr99/h3pM+vaRp7ij7EkjSRcUJYkrLOzn2GkMz5wN8pfz7Me6Wdp4AMvYC+VPsOVyLp5B+B5/zVrEhxLGZi1BOGgp6at0JFtAI2W/a9U2nFZQI4mfwf+xUM4Xf1G87wBcv9z0h6cIY8u/yVqml8lABbM3gp+AN4GvBd8RFGCKtdFvX8l+eP6pUOWgv68tXZHagQOqEpWEb+T34j6/H4P8n/lb46x/H+TP4hC3vaBcJs25O0cBPS0/EBCcJO/CZKlDkhrQBsUOHfAbxNVY/ENFvXU/h34H9Un5VhgQr28lPSxblIFMvU7y8UjYFUV/AYgAjfsLSjGHgMX5FFfhu8CJjNHtdPbYdpED4EU7D1lVqTf98xML7cTgV+QqNeEMDp1Dx+UVyb0wl4JUZdu6qpdwJ4nvxXAo8KW9PbqGSjwzcCl+pACLwU0xrJCcgMZP/ApQBm/g+bJyzBezbQXUo5q0yDd/M1Ah1u6/UUUHUcZosD2EddABdY1vWVe/vfB74xQl6ZJWbBSeTL2knCxGGU1W1RDyr9pLhcHxHYrfN9+Gdd7qmjW0TJvmMh4B3ybg3MH+BGCHh7+z0UnAHVdl4EvS6rfXMgwNWYUfx+qrKRU5D1+YbiCwgTAwA2Y/4qqbIvYMJMG4FrKPL1Aq6j+PUY/gX8SMMnAD8j/7Yg/snDRiyZh8llv8BM5LNfgm4UfgS8it2P/q3w6f1YjV08g9v7ysYv5S1JPTkT0xM/RvUtLx8HHqykyveEVYh/A8W9I9+EWfcwVQBgNf6zGO8CLi76v5r+gZ/S/Cvq+cAnKX4/gj3IvbqeB7wcWDnl/IqKA/CaZV2pVzqMGHgbXYgfrW75qLa+96i6dKEzeqqvbxnQqF4JoOcR3y4jhMvx28z4Ar9gN6aOW8g/8+DWHJ5kTNOAKyGsJP8l0lHYWfBO4P8gPQrcjvwT5Pfo+gPA6+zeT1o5ubKlZhd2a8c9SXBL0m0uQPo9wJPU/wq9O9gx8CdDLRgBq/cj3xOyPnYzTUtqt4DjhX8l7yOKgMIc4BvU/xGY5b1+YLiXASsRf7x39lUEXcV0qsAnymojFu9HYn+xB8D+B72L/ZmYEoOdRVKj45ZHPXy9p2lfqtq+IBfYP6C2YH5i5jDKeaPzo0gM7dGkH+VUM5TYBfmX3C1IH4ncClm+KEJs+7Bh6nc+aR9geOX2K0p7Ab6MKsI7kNf5JvNdODtmEZfqE+VfRYkXPxgBqgvsPvX8S4/g/03C1/HbE+wELvvKG8XZlbpBsR1AaZgd8LHYDZhebDgrwW6MPvo+4/fg4RPmO+L0VB0j0kU7Eim4W8E/E9+A/EW/Ongc8Bawd8mqgFYJ0D0/wYCEG5Zmi8lhJVgwS7gYfwO1xfbDUi2YO/q7F3gNzX4FW7L7r1HZ9tBeMZN6P82p5X1tPPW9yA7VM1h9/1MJpqq63X0ZPnbYC/A8e9zRL+u5h2oNq22bqA15Cj7cU0x2BHp28gfG2kgFfgjgJ6FDOaYCz2Bz+OjZzK/73/Yj2tPCBaJsKuAqqgZl0vRxNUC/hqr8A9eKx3rxsPNhXwH8wQVZH9O72rKaee5VRVm9M1lAZ2dbt8PLVBOIB3jRBEH0y7FHj1Ndv4PqkAaAbUQY7Cq5apxn44qBoqF7h6rJp8pjcmWWSxC9h8E6EqBVAvqatZQL2RNUwyCfGdCr0Bg7RQgLqmF5cN5p81xBI+i8kTfVrb6CP0x3sd4FiB/cF0y/P1j+Gyj6AwqZgqYG1lfqG+rP0/SJEKJxzPXJ9lZHHu4YcPQ/gd8AQwV1Bprv8BXwOeBLwP3Aw8T/pgNOY4/S9iZmU1Y8au+wlqw/x3vg8cH5L/McG+v+9x0bfzA5gN7A3+RHzG/BfX7b9YBWw+gBlu8z82axwEWfg2K+/AZyPt2xLzAcubYp5uAAcDLwJ+xe1FLKVOxOHQBM4P40L+HucHbP4n8K1kBSpKoqiKIqiKIqiKIqiKIqiKIqiKIqiKIqiKIqiKIqiKEpt/wFRAmaOGox/2QAAAEhta0JG+t7K/gAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKaQzoQAAAEFta0JTeJztfdtu4zoS5t9T0OuNsL0XB9v7vH3oBhoD7HmYPDSBD5w1do0z7cQPqkhCkkkqk1TpJNm+MFy3slSqKlXfX3T//x8AAAD//wMAgEw7lQAAAK1ta0JTeJrtV1tu2jAU/W8yJBqpm6rJEkdpU+0jTTUPa0m0YWLWGyXuGujj+7sYhNOMoq04BqdJnOvgx8fn7GM7AO7v7+/v7+/v/+T7Pzkg6/GCb+EXcUlK/Gnr+bR3kzgnceYpA3r0XOzqih8/XU/e0lBKMvxV33vO4B/pA7hY/i5+lCvwRVzj+/e/HHk9AXuP4r8YBk3oOz/NwuD9cz0Jr5cZrqczxC3KfrQnX8Vf8UP8xp/hRWzHRjrx3v8tx9+82X5JzIq8eJH7mHNWPE04iVfhL/BxWL51W9KgxZVBUCq/lw8zR9xn1L2U3z2e/Cq/sx+SpvUYg6zzJSj7KfEJf4/5jCOXvDv4pGXxXr6CDz+a/h1/1z8n1NyEf6w+HX+K/6Jv4gLXZWNcILvefVP76fYD+H8GNxFb+91u7T4KL6KH0jJHCiJ/9SYH+VT8Y1/SGin7qlymn5gzxBMH+6mN75I2mhiZ/jqeYnI/8F2xT5KfOCU+v2p+Dv9kPy0+CG+xNu3kI7vb4/z+1L7F3EZv27KtFF3Q5s3i8U2Nnlj9FjyL/H2HZ8Plv3xnTtLmF3x3MryReTcvuJlfAch+CcJ9/bZ5+dVMw4KxC6eX+bvH5I65zwEu7qHt/gqX5x9j/C9v7x7bb/l27Kv+EYS88fzFf0OHp3cBQt+hN9Ti/C9v7iJ68Rvf/fqD/4Qv+M/fik/4t+y/lvfPZd1v3PXt+P7+dgtB7u7uffdL5HXTgqhpCx/5FdU7awUfnHLujP1K/fKv9T9AA/DAC/rrz3nJs2T+TMEVCuhnqXP/+lYh0fZ2JihJsV/uUPDZqWxOKKMRwnT5OPwl/yCYyLRLdd5k76rQcX58FP2UXHzbUD9QVl3f8T8vvj8C6YE9w0+Kn6JfbHfcaC+D1y3nS/2n8V3k05SO3GgpCxh2aZJGZmK5/BXsnsBoPj1PHs6iqi7+FZ8rEXa7fKaC6vvs+rbP6OhgJrkgX1jRN7g4jh/+Kvp/gMnnOpXd7i29/J3PO2s/SZn6jfsLfxgmkHONZ7rFHBChDhSz0UvT/gtvxHbwgPI/m6R5+5PJn+LzXPwueUHYpbT4mLp9fcJ4/5Ld6KXzGZzIPVTU+Lw0/VXL64n+JlP6K/7ZB0l+IJRfH3+/ONe44tOrT48/Tlvj6Lk7QV0jf13hLbT43nm7jcOXgPT9Q/y2E1v+0mqS+Onhgh3Ol/X2V/2Vf7+Pf0q6Lzr4X8r54Cvs2d4paLEr6OP+S7k7nZ5jqL8zwksTWse4+O+3zv+Fj0nFWON0VuapqbvT1rK0WPes8v+OPf5uOz41vkN07o1zhb0Y+JYzBNfp3/oif+X8GUf8L7SdjTf/WH19P8DTkgy3P8Ytu+M9f/8Re3/WQAADvtbWxEAAAeGbW1sZEBBTYBr4AAAB7Vta0JTeJtsyjkQBDEQBE8Ponbbdg1gzP+3xPfBuWZ7M19F1wCAozMcAAAAADtjbW9qd25mYWNzAAAAAP//AwADAAAA1V+0UgAAAKxta0JTeJvtkM0OAyEMhS9ryAVKa8vGfVR/7dMefRQPIL0iCQlScZ9gY1s/GaZDWCkAAAD//wMAvgUAAACQbW1sZEBBTYBr4AAAACVta0JTeJtt0LEOwjAUheHGaazWXa1K6CSK2KAh4rCDg4TBBgQFjQ=="/>
    </defs>
  </svg>
);

const GUEST_SVG = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
    <rect width="24" height="24" fill="url(#pattern0_44_380)"/>
    <defs>
      <pattern id="pattern0_44_380" patternContentUnits="objectBoundingBox" width="1" height="1">
        <use xlinkHref="#image0_44_380" transform="scale(0.0078125)"/>
      </pattern>
      <image id="image0_44_380" width="128" height="128" preserveAspectRatio="none" xlinkHref="data:image/png;base64,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"/>
    </defs>
  </svg>
);

const STAR_SVG = ({ filled, half }: { filled: boolean, half?: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
    <rect width="25" height="25" fill={filled ? "url(#pattern0_280_19)" : "none"}/>
    <defs>
      <pattern id="pattern0_280_19" patternContentUnits="objectBoundingBox" width="1" height="1">
        <use xlinkHref="#image0_280_19" transform="scale(0.0078125)"/>
      </pattern>
      <image id="image0_280_19" width="128" height="128" preserveAspectRatio="none" xlinkHref="data:image/png;base64,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"/>
    </defs>
  </svg>
);

export const HotelRoomsGrid = () => {
  const [showAll, setShowAll] = useState(false);

  const roomImages = [
    Displayroom1,
    Displayroom2,
    Displayroom3,
    Displayroom4,
    Displayroom5,
    Displayroom6,
    Displayroom7,
    Displayroom8,
    Displayroom9
  ];

  const amenities = [
    "WiFi", "Pool", "Gym", "Spa", "Parking", "Restaurant", 
    "Bar", "Room Service", "Laundry", "Concierge", "Business Center", 
    "Pet Friendly", "Beach Access", "Mountain View", "City View"
  ];

  const hotelData = [
    { name: "Delta hotel Durban", rating: 3.5, amenities: ["WiFi", "Pool", "Parking"], bedrooms: 2, bathrooms: 1, guests: 4, price: 1200 },
    { name: "Delta hotel Cape Town", rating: 5, amenities: ["WiFi", "Spa", "Beach Access"], bedrooms: 3, bathrooms: 2, guests: 6, price: 2500 },
    { name: "Delta hotel Sandton", rating: 4, amenities: ["WiFi", "Gym", "Business Center"], bedrooms: 1, bathrooms: 1, guests: 2, price: 800 },
    { name: "Delta hotel Waterkloof", rating: 3, amenities: ["WiFi", "Parking", "Restaurant"], bedrooms: 2, bathrooms: 1, guests: 4, price: 1000 },
    { name: "Delta hotel Stellenbosch", rating: 4.5, amenities: ["WiFi", "Spa", "Mountain View"], bedrooms: 3, bathrooms: 3, guests: 6, price: 3200 },
    { name: "Delta hotel Durban", rating: 3.5, amenities: ["WiFi", "Pool", "Room Service"], bedrooms: 1, bathrooms: 1, guests: 2, price: 750 },
    { name: "Delta hotel Cape Town", rating: 4.5, amenities: ["WiFi", "Pool", "Bar"], bedrooms: 2, bathrooms: 1, guests: 4, price: 1800 },
    { name: "Delta hotel Sandton", rating: 3, amenities: ["WiFi", "Parking", "Concierge"], bedrooms: 3, bathrooms: 2, guests: 6, price: 2200 },
    { name: "Delta hotel Waterkloof", rating: 4, amenities: ["WiFi", "Gym", "Laundry"], bedrooms: 2, bathrooms: 1, guests: 3, price: 950 }
  ];

  const numberOfRooms = showAll ? 9 : 6;

  return (
    <div className={styles.hotelGridWrapper}>
      <div className={styles.hotelGrid}>
        {Array.from({ length: numberOfRooms }).map((_, index) => (
          <div key={index} className={styles.hotelCard}>
            <img 
              src={roomImages[index]} 
              alt={`Room ${index + 1}`}
              className={styles.hotelImage}
            />
            <div className={styles.amenitiesContainer}>
              {hotelData[index].amenities.map((amenity, i) => (
                <AMENITY_BADGE key={i} text={amenity} />
              ))}
            </div>
            <div className={styles.hotelNameContainer}>
              <h4 className={styles.hotelName}>{hotelData[index].name}</h4>
              <div className={styles.stars}>
                {Array.from({ length: 5 }).map((_, i) => {
                  const rating = hotelData[index].rating;
                  if (i + 1 <= rating) {
                    return <span key={i}><STAR_SVG filled={true} half={false} /></span>;
                  } else if (i < rating && i + 1 > rating) {
                    return <span key={i}><STAR_SVG filled={false} half={true} /></span>;
                  } else {
                    return <span key={i}><STAR_SVG filled={false} half={false} /></span>;
                  }
                })}
              </div>
            </div>
            <div className={styles.roomDetailsContainer}>
              <ROOM_BADGE bedrooms={hotelData[index].bedrooms} bathrooms={hotelData[index].bathrooms} guests={hotelData[index].guests} />
            </div>
            <div className={styles.price}>
              R{hotelData[index].price}/day
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setShowAll(!showAll)}
        className={styles.viewAllBtn}
      >
        {showAll ? "Show Less" : "View All"}
      </button>
    </div>
  );
};
