import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";
interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  pageCount,
  onPageChange,
}: PaginationProps) {
  return (
    <ReactPaginate
      pageCount={pageCount}
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      onPageChange={({ selected }) => onPageChange(selected + 1)}
      forcePage={page - 1}
      containerClassName={css.pagination}
      activeClassName={css.active}
      nextLabel="→"
      previousLabel="←"
    />
  );
}
