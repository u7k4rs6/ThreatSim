import React from "react";

function MovieCard() {
  return (
    <div
      className="h-[40vh] w-[200px] bg-cover flex items-end rounded-lg hover:scale-110 duration-300"
      style={{
        backgroundImage: `url(https://img.buzzfeed.com/buzzfeed-static/complex/images/wjnhpz3osrai5aningjl/titanic.jpg?downsize=900:*&output-format=auto&output-quality=auto)`,
      }}
    >
      <div
        className="m-4 flex justify-center h-8 w-8 items-center rounded-lg bg-gray-900/60"
      >
        &#128525;
      </div>

      <div className="text-white w-full text-center text-xl p-2 bg-gray-900/70 rounded-lg">
        Titanic
      </div>
    </div>
  );
}

export default MovieCard;
