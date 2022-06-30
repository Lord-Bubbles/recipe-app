import React from "react";
import classnames from "classnames";
import "../styles/Pagination.scss";

const range = (from, to) => {
  let length = to - from + 1;
  return Array.from({length}, (_, idx) => idx + from);
}

const DOTS = "...";

// TODO (issue 17): Pagination component
class Pagination extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1
    };
    this.totalPages = Math.ceil(this.props.total / this.props.pageSize);
    this.siblingCount = 1;
  }

  componentDidMount() {
    this.gotoPage(1);
  }

  gotoPage = (page) => {
    const currentPage = Math.max(0, Math.min(page, this.totalPages));
    const paginationData = {
      currentPage: currentPage,
      totalPages: this.totalPages,
      pageLimit: this.props.pageSize,
      totalRecords: this.props.total
    };
    this.setState({currentPage: currentPage}, () => this.props.onPageChanged(paginationData));
  }

  handleClick = (page) => {
    this.gotoPage(page);
  }

  handleLeft = () => {
    this.gotoPage(this.state.currentPage - 1);
  }

  handleRight = () => {
    this.gotoPage(this.state.currentPage + 1);
  }

  fetchPageNumbers = () => {
    const totalCount = this.totalPages;
    const currentPage = this.props.currentPage;
    const siblings = this.siblingCount;

    const totalNumbers = siblings + 5;

    if (totalNumbers >= totalCount) {
      return range(1, totalCount);
    }

    const leftSiblingIndex = Math.max(currentPage - siblings, 1);
    const rightSiblingIndex = Math.min(currentPage + siblings, totalCount);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalCount - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalCount;

    // Currentpage + firstpage + lastpage + 2 * numSiblings
    const itemCount = 3 + 2 * siblings;

    if (!showLeftDots && showRightDots) {
      let leftRange = range(1, itemCount);
      return [...leftRange, DOTS, totalCount];
    }

    if (showLeftDots && !showRightDots) {
      let rightRange = range(totalCount - itemCount + 1, totalCount);
      return [firstPageIndex, DOTS, ...rightRange];
    }

    if (showLeftDots && showRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }
  }

  render() {
    const paginationRange = this.fetchPageNumbers();
    const lastPage = paginationRange[paginationRange.length - 1];
    if (this.props.currentPage == 0 || paginationRange.length < 2) {
      return null;
    }
    return (
      <div>
        <ul className={classnames("pagination-container")}>
          <li
            className={classnames("pagination-item", {
              disabled: this.state.currentPage == 1
            })}
            onClick={this.handleLeft}
          >
            <div className="arrow-left"></div>
          </li>
          {/* render page pills */
            paginationRange.map(page => {
              if (page == DOTS) {
                return <li className="pagination-item-dots">&#8230;</li>;
              }

              return (
                <li
                  className={classnames("pagination-item", {
                    selected: page == this.state.currentPage
                  })}
                  onClick={() => this.handleClick(page)}
                >
                  {page}
                </li>
              );
            })
          }
          <li
            className={classnames("pagination-item", {
              disabled: this.state.currentPage == lastPage
            })}
            onClick={this.handleRight}
          >
            <div className="arrow-right"></div>
          </li>
        </ul>
      </div>
    );
  }
}

export default Pagination;
