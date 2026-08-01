import type { TrackerAPI, Tracker } from "~/components/dashboard/home/tracker-card";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useContext, useEffect, useState } from "react";
import { api } from "~/root";
import { UserContext } from "~/context/user-context";


const columnHelper = createColumnHelper<Tracker>();

export default function TrackerHistory() {
    const { age } = useContext(UserContext)!;
    const [loading, setLoading] = useState(true);

    const [createdAt, setCreatedAt] = useState("");
    const [bedtime, setBedtime] = useState("");
    const [wakeup, setWakeup] = useState("");
    const [awakenings, setAwakenings] = useState(0);
    const [timeInBed, setTimeInBed]= useState(0);
    // const [sleepDuration, setSleepDuration]= useState(0);
    // const [sleepEfficiency, setSleepEfficiency] = useState(0);
    // const [isGoodSleep, setIsGoodSleep] = useState(true);

    
    let sleepDuration: number = 0;
    if(bedtime && wakeup) {
        const [startHour, startMinute] = bedtime.split(":").map(Number);
        const [endHour, endMinute] = wakeup.split(":").map(Number);
        const start = startHour * 60 + startMinute;
        let end = endHour * 60 + endMinute;

        let diff = end - start;
        
        if (diff < 0) {
            end += 24 * 60;
            diff = end - start;
        }

        sleepDuration = (diff / 60);
    }

    const sleepEfficiency =
    timeInBed > 0
        ? sleepDuration / timeInBed
        : 0;

    const isGoodSleep =
        (age >= 18 &&
            age < 65 &&
            sleepDuration >= 7 &&
            sleepDuration <= 9 &&
            awakenings <= 1 &&
            sleepEfficiency >= 0.875) ||

        (age >= 65 &&
            sleepDuration >= 7 &&
            sleepDuration <= 8 &&
            awakenings <= 2 &&
            sleepEfficiency >= 0.875);

    const [data, setData] = useState<Tracker[]>([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [maxDate, setMaxDate] = useState("");
    const [total, setTotal] = useState(0);

    const [modal, setModal] = useState<{
        type: "add" | "edit" | "delete" | null;
        tracker?: Tracker;
    }>({
        type: null,
    });


    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });



    const columns = [
        columnHelper.accessor("created_at", {
            header: "Date",
            cell: (info) => {
                const value = info.getValue();

                if (!value) {
                    return <span className="text-gray-400">No Record</span>;
                }

                return new Date(value).toLocaleDateString();
            },
        }),

        columnHelper.accessor("bedtime", {
            header: "Bedtime",
            cell: (info) => {
                const value = info.getValue();

                return value ?? (
                    <span className="text-gray-400">No Record</span>
                );
            },
        }),

        columnHelper.accessor("wakeup", {
            header: "Wakeup",
            cell: (info) => {
                const value = info.getValue();

                return value ?? (
                    <span className="text-gray-400">No Record</span>
                );
            },
        }),

        columnHelper.accessor("sleepDuration", {
            header: "Sleep Duration",
            cell: (info) => {
                const value = info.getValue();

                if (value == null) {
                    return <span className="text-gray-400">No Record</span>;
                }

                return `${Math.floor(value)} hours ${Math.round(
                    (value % 1) * 60
                )} minutes`;
            },
        }),

        columnHelper.accessor("sleepEfficiency", {
            header: "Sleep Efficiency",
            cell: (info) => {
                const value = info.getValue();

                if (value == null) {
                    return <span className="text-gray-400">No Record</span>;
                }

                return `${(value * 100).toFixed(2)}%`;
            },
        }),

        columnHelper.accessor("awakenings", {
            header: "Awakenings",
            cell: (info) => {
                const value = info.getValue();

                return value ?? (
                    <span className="text-gray-400">No Record</span>
                );
            },
        }),

        columnHelper.accessor("timeInBed", {
            header: "Time in Bed",
            cell: (info) => {
                const value = info.getValue();

                if (value == null) {
                    return <span className="text-gray-400">No Record</span>;
                }

                return `${value} h`;
            },
        }),

        columnHelper.accessor("isGoodSleep", {
            header: "Sleep Quality",
            cell: (info) => {
                const value = info.getValue();

                if (value == null) {
                    return (
                        <span className="rounded bg-gray-100 px-2 py-1 text-sm text-gray-500">
                            No Record
                        </span>
                    );
                }

                return value ? (
                    <span className="rounded bg-green-100 px-2 py-1 text-sm font-medium text-green-700">
                        Good
                    </span>
                ) : (
                    <span className="rounded bg-red-100 px-2 py-1 text-sm font-medium text-red-700">
                        Poor
                    </span>
                );
            },
        }),

        columnHelper.accessor("updated_at", {
            header: "Updated At",
            cell: (info) => {
                const value = info.getValue();

                if (!value) {
                    return <span className="text-gray-400">No Record</span>;
                }

                return new Date(value).toLocaleDateString();
            },
        }),

        columnHelper.display({
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const tracker = row.original;

                return tracker.id ? (
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleEdit(tracker.id!)}
                            className="rounded bg-yellow-500 px-3 py-1 text-sm text-white hover:bg-yellow-600"
                        >
                            Edit
                        </button>

                        <button
                            onClick={() => handleDelete(tracker.id!)}
                            className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                        >
                            Delete
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => handleAdd(tracker)}
                        className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700"
                    >
                        Add
                    </button>
                );
            },
        }),
    ];

    const handleAdd = (tracker: Tracker) => {
        setCreatedAt(tracker.created_at!);
        setModal({
            type: "add",
            tracker,
        });
    };

    const handleEdit = (id: number) => {
        const tracker = data.find((t) => t.id === id);
        if (!tracker) return;

        setBedtime(tracker.bedtime!);
        setWakeup(tracker.wakeup!);
        setAwakenings(tracker.awakenings!);
        setTimeInBed(tracker.timeInBed!);
        // setSleepDuration(tracker.sleepDuration!);
        // setSleepEfficiency(tracker.sleepEfficiency!);
        // setIsGoodSleep(tracker.isGoodSleep!);

        setModal({
            type: "edit",
            tracker,
        });
    };

    const handleDelete = (id: number) => {
        const tracker = data.find((t) => t.id === id);

        setModal({
            type: "delete",
            tracker,
        });
    };

    const closeModal = () => setModal({ type: null, });

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: Math.ceil(total / pagination.pageSize),
        state: {
            pagination,
        },
        onPaginationChange: setPagination,
    });

    const fetchTrackers = async () => {
        const res = await api.get("/sleep/tracker", {
            params: {
                page: pagination.pageIndex + 1,
                page_size: pagination.pageSize,
                start_date: startDate || undefined,
                end_date: endDate || undefined,
            },
        });

        setData(res.data.items);
        setTotal(res.data.total);
    };

    useEffect(() => {
        fetchTrackers();
    }, [pagination, startDate, endDate]);


    useEffect(() => {
        const today = new Date();
        const tenDaysAgo = new Date(today);

        tenDaysAgo.setDate(today.getDate() - 10);

        setStartDate(tenDaysAgo.toISOString().split("T")[0]);
        setEndDate(today.toISOString().split("T")[0]);
        setMaxDate(today.toISOString().split("T")[0]);
        setLoading(false);
    }, []);

    const handleAddSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        if (!bedtime || !wakeup || timeInBed < sleepDuration || !createdAt) {
            return;
        }

        const payload = {
            wakeup,
            bedtime,
            sleepDuration,
            sleepEfficiency,
            awakenings,
            timeInBed,
            isGoodSleep,
            created_at: createdAt
        };

        try {
            await api.post("/sleep/tracker", payload);

            closeModal();
            fetchTrackers();
        } catch (err) {
            console.error(err);
        }
    };


    const handleEditSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        if (!modal.tracker?.id) return;

        if (!bedtime || !wakeup || timeInBed < sleepDuration) {
            return;
        }
        console.log(sleepDuration, sleepEfficiency, isGoodSleep);

        const payload = {
            wakeup,
            bedtime,
            sleepDuration,
            sleepEfficiency,
            awakenings,
            timeInBed,
            isGoodSleep,
        };

        try {
            await api.put(`/sleep/tracker/${modal.tracker.id}`, payload);

            closeModal();

            fetchTrackers();
        } catch (err) {
            console.error(err);
        }
    };


    const handleDeleteSubmit = async () => {
        if (!modal.tracker?.id) return;

        try {
            await api.delete(`/sleep/tracker/${modal.tracker.id}`);

            closeModal();

            fetchTrackers();
        } catch (err) {
            console.error(err);
        }
    };

    if(loading){
        return(
            <div className="flex items-center justify-center py-10">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-indigo-600"></div>
            </div>
        )
    }


    return(
        <>
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">

                <div className="mb-4 flex items-end gap-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            From
                        </label>

                        <input
                            type="date"
                            max={endDate}
                            value={startDate}
                            onChange={(e) => {
                                setPagination(p => ({ ...p, pageIndex: 0 }));
                                setStartDate(e.target.value);
                            }}
                            className="rounded border px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            To
                        </label>

                        <input
                            type="date"
                            min={startDate}
                            max={maxDate}
                            value={endDate}
                            onChange={(e) => {
                                setPagination(p => ({ ...p, pageIndex: 0 }));
                                setEndDate(e.target.value);
                            }}
                            className="rounded border px-3 py-2"
                        />
                    </div>

                    <button
                        onClick={() => {
                            setPagination({ pageIndex: 0, pageSize: 10 });
                            setStartDate("");
                            setEndDate("");
                        }}
                        className="rounded border px-4 py-2"
                    >
                        Clear
                    </button>
                </div>


                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-4 py-3 text-left text-sm font-semibold text-gray-700"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="hover:bg-gray-50"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className="px-4 py-3 text-sm text-gray-700"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (   
                            <tr>
                                <td
                                    colSpan={table.getAllColumns().length}
                                    className="py-8 text-center text-gray-500"
                                >
                                    No tracker history found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-600">
                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
                </span>

                <div className="flex gap-2">
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="rounded border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Previous
                    </button>

                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="rounded border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>


            {modal.type && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={closeModal}
                >
                    <div
                        className="w-full max-w-md rounded-2xl bg-white shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}

                        <div className="flex items-center justify-between border-b px-6 py-4">
                            <h2 className="text-xl font-semibold">
                                {modal.type === "add" && "Add Sleep Tracker"}
                                {modal.type === "edit" && "Edit Sleep Tracker"}
                                {modal.type === "delete" && "Delete Sleep Tracker"}
                            </h2>

                            <button
                                onClick={closeModal}
                                className="text-xl text-gray-500 hover:text-gray-700"
                            >
                                ×
                            </button>
                        </div>

                        {/* Body */}

                        <div className="p-6">
                            {modal.type === "delete" ? (
                                <>
                                    <p className="text-gray-600">
                                        Are you sure you want to delete this tracker?
                                    </p>

                                    <div className="mt-6 flex justify-end gap-3">
                                        <button
                                            onClick={closeModal}
                                            className="rounded border px-4 py-2"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            onClick={() => {
                                                handleDeleteSubmit();
                                            }}
                                            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <form
                                    onSubmit={
                                        modal.type === "add"
                                            ? handleAddSubmit
                                            : handleEditSubmit
                                    }
                                >
                                    <div className="flex gap-5">

                                        <div className="flex-1">
                                            <label className="mb-2 block text-sm font-medium">
                                                Bedtime
                                            </label>

                                            <input
                                                type="time"
                                                value={bedtime}
                                                onChange={(e) => setBedtime(e.target.value)}
                                                className="w-full rounded-lg border p-2.5"
                                            />
                                        </div>

                                        <div className="flex-1">
                                            <label className="mb-2 block text-sm font-medium">
                                                Wake-up Time
                                            </label>

                                            <input
                                                type="time"
                                                value={wakeup}
                                                onChange={(e) => setWakeup(e.target.value)}
                                                className="w-full rounded-lg border p-2.5"
                                            />
                                        </div>

                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium">
                                            Awakenings
                                        </label>

                                        <input
                                            type="number"
                                            value={awakenings}
                                            onChange={(e) => setAwakenings(Number(e.target.value))}
                                            className="w-full rounded-lg border p-2.5"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium">
                                            Time in Bed (hours)
                                        </label>

                                        <input
                                            type="number"
                                            value={timeInBed}
                                            step={0.5}
                                            onChange={(e) => setTimeInBed(Number(e.target.value))}
                                            className="w-full rounded-lg border p-2.5"
                                        />
                                    </div>

                                    <div className="flex justify-end gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="rounded border px-4 py-2"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            className={`rounded px-4 py-2 text-white ${
                                                modal.type === "add"
                                                    ? "bg-green-600 hover:bg-green-700"
                                                    : "bg-indigo-600 hover:bg-indigo-700"
                                            }`}
                                        >
                                            {modal.type === "add"
                                                ? "Add Tracker"
                                                : "Save Changes"}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );

}