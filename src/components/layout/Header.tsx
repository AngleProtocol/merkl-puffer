import {
  Button,
  Container,
  Dropdown,
  Group,
  Icon,
  WalletButton,
  useTheme,
} from "dappkit";
import { Image } from "dappkit";
import customerDarkLogo from "src/customer/assets/images/customer-dark-logo.svg";
import customerLogo from "src/customer/assets/images/customer-logo.svg";

import { motion } from "framer-motion";
import config from "merkl.config";
import { useWalletContext } from "packages/dappkit/src/context/Wallet.context";
import { useMemo, useState } from "react";
import SwitchMode from "../element/SwitchMode";
import SearchBar from "../element/functions/SearchBar";
import { LayerMenu } from "./LayerMenu";

const container = {
  hidden: { opacity: 0, y: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { y: "-100%" },
  visible: {
    y: 0,
  },
};

export default function Header() {
  const { mode } = useTheme();
  const { address: user } = useWalletContext();
  const [open, setOpen] = useState<boolean>(false);

  const routes = useMemo(() => {
    const { homepage, ...rest } = config.routes;

    return Object.assign(
      { homepage },
      {
        dashboard: {
          icon: "RiPlanetFill",
          route: user ? `/users/${user}` : "/users",
          key: crypto.randomUUID(),
        },
      },
      rest
    );
  }, [user]);

  return (
    <motion.header
      variants={container}
      initial="hidden"
      whileInView="visible"
      className="w-full sticky left-0 top-0 z-20 backdrop-blur">
      <Container className="py-xl">
        <Group className="justify-between items-center">
          <motion.div variants={item}>
            <Dropdown
              size="lg"
              padding="xs"
              open={open}
              content={<LayerMenu nav={routes} setOpen={setOpen} />}
              className="lg:hidden flex gap-sm md:gap-lg items-center"
            >
              <Image
                className="w-[140px] md:w-[200px]"
                alt={`${config.appName} logo`}
                src={mode !== "dark" ? customerDarkLogo : customerLogo}
              />
              <Icon className="text-main-12" remix="RiArrowDownSLine" />
            </Dropdown>

            <Button
              className="hidden lg:flex"
              size="lg"
              to={routes.homepage.route}
              look="soft"
            >
              <Image
                className="w-[200px]"
                alt={`${config.appName} logo`}
                src={mode !== "dark" ? customerDarkLogo : customerLogo}
              />
            </Button>
          </motion.div>

          <motion.div variants={item}>
            <Group className="items-center" size="xl">
              <Group className="hidden lg:flex items-center" size="xl">
                {Object.entries(routes)
                  .filter(
                    ([key]) => !["homepage", "privacy", "terms"].includes(key)
                  )
                  .map(([key, { route }]) => {
                    return (
                      <Button
                        className="capitalize"
                        look="soft"
                        size="lg"
                        key={`${key}-link`}
                        to={route}
                      >
                        {key}
                      </Button>
                    );
                  })}
                <Group className="items-center">
                  <SwitchMode />
                  <SearchBar icon={true} />
                </Group>
              </Group>

              <Group className="hidden md:flex">
                <WalletButton />
              </Group>
            </Group>
          </motion.div>
        </Group>
      </Container>
    </motion.header>
  );
}
