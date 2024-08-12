"use client";
/* eslint-disable @next/next/no-img-element */
import { FC, useState } from "react";
import { Command, CommandGroup, CommandItem } from "cmdk";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid";
import * as Popover from "@radix-ui/react-popover";
import { cn } from "@/utilities/tailwind";
import { chainImgDictionary } from "@/utilities/chainImgDictionary";
import { Chain } from "viem";

interface NetworkDropdownProps {
  onSelectFunction: (value: number) => void;
  previousValue?: number;
  networks: Chain[];
  defaultValue: number;
}

export const NetworkDropdown: FC<NetworkDropdownProps> = ({
  onSelectFunction,
  previousValue,
  networks,
  defaultValue,
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<number>(previousValue || defaultValue);

  // sort networks by name alphabetically
  const sortedNetworks = networks.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger className="min-w-[240px] max-w-full w-max  justify-between text-black dark:text-white dark:bg-zinc-800 flex flex-row gap-2 px-4 py-2 items-center bg-gray-100 rounded-md">
        {value ? (
          <div className="flex flex-row gap-2 items-center">
            <img src={chainImgDictionary(value)} alt={""} className="w-5 h-5" />
            <p>{networks.find((community) => community.id === value)?.name} </p>
          </div>
        ) : (
          "Select community"
        )}
        <ChevronUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Popover.Trigger>
      <Popover.Content
        align="start"
        className="mt-4 w-max z-10 bg-white border border-zinc-200 dark:border-zinc-700 rounded-md dark:text-white dark:bg-zinc-800  max-h-60 overflow-y-auto overflow-x-hidden py-2"
      >
        <Command>
          <CommandGroup>
            {sortedNetworks.map((network) => (
              <CommandItem
                key={network.id}
                onSelect={() => {
                  setValue(network.id);
                  setOpen(false);
                  onSelectFunction(network.id);
                }}
                className="my-1 cursor-pointer hover:opacity-75 text-sm flex flex-row items-center justify-start py-2 px-4 hover:bg-zinc-200 dark:hover:bg-zinc-900"
              >
                <CheckIcon
                  className={cn(
                    "mr-2 h-4 w-4 min-w-4 min-h-4 text-black dark:text-white",
                    value === network.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-row gap-2 items-center justify-start w-full">
                  <div className="min-w-5 min-h-5 w-5 h-5 m-0">
                    <img
                      src={chainImgDictionary(network.id)}
                      alt={""}
                      className="min-w-5 min-h-5 w-5 h-5 m-0 rounded-full"
                    />
                  </div>
                  <div className="flex flex-row gap-1  items-center justify-start  flex-1">
                    <p className="line-clamp-2 text-sm max-w-full break-normal">
                      {network.name}
                    </p>
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </Popover.Content>
    </Popover.Root>
  );
};
