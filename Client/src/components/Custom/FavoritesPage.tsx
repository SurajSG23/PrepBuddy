import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface FavoritesPageProps {
  userID: string;
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({ userID }) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("favoriteCompanies");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const startTest = (company: string) => {
    localStorage.setItem(
      "currentTest",
      JSON.stringify({
        title: company,
        difficulty: "Medium",
        userid: userID,
        createdAt: new Date(),
      })
    );
    navigate("/testpage");
  };

  const removeFromFavorites = (company: string) => {
    const updated = favorites.filter((c) => c !== company);
    setFavorites(updated);
    localStorage.setItem("favoriteCompanies", JSON.stringify(updated));
  };

  return (

    <div className="container mx-auto px-4 py-6">
            <button className="mb-4 text-indigo-400 hover:text-indigo-200 underline" onClick={() => navigate("/")}>
               ← Back to Home
            </button>

      <h1 className="text-3xl font-bold text-indigo-500 text-center mb-8">
        Your Favorite Companies
      </h1>

      {favorites.length === 0 ? (
        <p className="text-center text-gray-400">
          No favorites yet. Go back to the homepage and add some!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((company) => (
            <div
              key={company}
              className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl hover:bg-gray-900 transition"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold mb-3">{company}</h3>
                <div className="flex items-center gap-2">
                  <img
                    src={`https://logo.clearbit.com/${company.toLowerCase()}.com`}
                    alt={`${company} logo`}
                    width={50}
                  />
                  <button
                    className="text-yellow-400 text-2xl"
                    onClick={() => removeFromFavorites(company)}
                    title="Remove from Favorites"
                  >
                    &#9733;
                  </button>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                Take the {company} aptitude test to practice for your interview.
              </p>
              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition cursor-pointer"
                onClick={() => startTest(company)}
              >
                Start Test
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
