import { useSearchItems } from "../generateBill/hooks/useSearchItems";
import "../styles/searchBar.css";

export function SearchBar({ widthInPercent }) {
  const { state, dispatch } = useSearchItems();

  return (
    <div
      id="searchBarContainer"
      style={{ width: `${widthInPercent ? widthInPercent : 100}%` }}
    >
      <input
        type="text"
        id="inputEl"
        placeholder="Search Products"
        value={state.searchQuery}
        onChange={(e) =>
          dispatch({
            type: "SET_SEARCH_QUERY",
            payload: { curVal: e.target.value },
          })
        }
      />
      <a className="searchBtn">🔍</a>
    </div>
  );
}
