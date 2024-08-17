import classnames from 'classnames';
import '@/styles/Pagination.scss';

const range = (from, to) => {
  let length = to - from + 1;
  return Array.from({ length: length }, (_, idx) => idx + from);
};

const DOTS = '...';

// Renders pagination of recipe view component
export default function Pagination(props) {
  const {
    siblings = 1,
    onPageChange,
    currentPage,
    totalCount,
    pageSize
  } = props;

  const handlePageChange = (amount) => {
    onPageChange((current) => {
      return current + amount;
    });
  };

  const fetchPageNumbers = () => {
    const totalPageCount = Math.ceil(totalCount / pageSize);

    // Number of pages to display in pagination bar is determined as
    // siblingCount + firstPage + lastPage + currentPage + 2*DOTS
    const totalPageNumbers = siblings + 5;

    // Case 1:
    // If the number of pages is less than the page numbers we want to show in
    // our paginationComponent, we return the range [1..totalPageCount]
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }

    // Calculate left and right sibling index and make sure they are within
    // range 1 and totalPageCount
    const leftSiblingIndex = Math.max(currentPage - siblings, 1);
    const rightSiblingIndex = Math.min(currentPage + siblings, totalPageCount);

    // We do not show dots just when there is just one page number to be
    // inserted between the extremes of sibling and the page limits i.e 1 and
    // totalPageCount. Hence we are using leftSiblingIndex > 2 and
    // rightSiblingIndex < totalPageCount - 2
    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPageCount - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    // For the side without dots, always show this number of pages in the
    // pagination bar
    const itemCount = 3 + 2 * siblings;

    // Case 2: No left dots to show, but rights dots to be shown
    if (!showLeftDots && showRightDots) {
      let leftRange = range(1, itemCount);
      return [...leftRange, DOTS, totalPageCount];
    }

    // Case 3: No right dots to show, but left dots to be shown
    if (showLeftDots && !showRightDots) {
      let rightRange = range(totalPageCount - itemCount + 1, totalPageCount);
      return [firstPageIndex, DOTS, ...rightRange];
    }

    // Case 4: Both left and right dots to be shown
    if (showLeftDots && showRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }
  };

  const paginationRange = fetchPageNumbers();
  const lastPage = paginationRange[paginationRange.length - 1];
  if (paginationRange.length < 2) {
    return null;
  }
  return (
    <ul className={classnames('pagination-container')}>
      <li
        className={classnames('pagination-item', {
          disabled: currentPage === 1
        })}
        onClick={() => handlePageChange(-1)}
      >
        <div className="arrow left"></div>
      </li>
      {
        // render page pills
        paginationRange.map((pageNum) => {
          if (pageNum === DOTS) {
            return <li className="pagination-item dots">&#8230;</li>;
          }

          return (
            <li
              className={classnames('pagination-item', {
                selected: pageNum === currentPage
              })}
              onClick={() => onPageChange(pageNum)}
            >
              {pageNum}
            </li>
          );
        })
      }
      <li
        className={classnames('pagination-item', {
          disabled: currentPage === lastPage
        })}
        onClick={() => handlePageChange(1)}
      >
        <div className="arrow right"></div>
      </li>
    </ul>
  );
}
