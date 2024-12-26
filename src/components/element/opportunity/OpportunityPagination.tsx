import { Button, Group, Icon, Select } from "dappkit/src";
import { useMemo } from "react";
import useSearchParamState from "src/hooks/filtering/useSearchParamState";

export type OpportunityPaginationProps = {
  count?: number;
};

export default function OpportunityPagination({ count }: OpportunityPaginationProps) {
  const [pageFilter, setPageFilter] = useSearchParamState<number>(
    "page",
    v => v.toString(),
    v => Number.parseInt(v),
  );

  const [itemsFilter, setItemsFilter] = useSearchParamState<number>(
    "items",
    v => v.toString(),
    v => Number.parseInt(v),
  );

  const pages = useMemo(() => Math.ceil((count ?? 0) / Math.max(50, itemsFilter ?? 0)), [count, itemsFilter]);
  const pageOptions = useMemo(() => {
    return [...Array(Math.max(Math.round(pages ?? 0), 1)).fill(0)]
      .map((_, index) => index + 1)
      .reduce((obj, index) => Object.assign(obj, { [index]: index }), {});
  }, [pages]);

  return (
    <Group className="justify-between">
      <Group>
        <Select
          state={[Math.max(50, itemsFilter ?? 0), setItemsFilter]}
          look="base"
          size="xs"
          options={{ 25: "25", 50: "50", 75: "75", 100: "100" }}
        />
      </Group>
      <Group>
        <Button
          look="base"
          size="xs"
          disabled={(pageFilter ?? 0) <= 1}
          onClick={() => setPageFilter(Math.max(1, (pageFilter ?? 0) - 1))}>
          <Icon remix="RiArrowLeftLine" />
        </Button>
        <Select
          state={[Math.max(1, (pageFilter ?? 0) - 1), setPageFilter]}
          look="base"
          size="xs"
          options={pageOptions}
        />
        <Button
          look="base"
          size="xs"
          disabled={(pageFilter ?? 0) >= pages}
          onClick={() => setPageFilter(Math.min(pages, (pageFilter ?? 0) + 1))}>
          <Icon remix="RiArrowRightLine" />
        </Button>
      </Group>
    </Group>
  );
}
