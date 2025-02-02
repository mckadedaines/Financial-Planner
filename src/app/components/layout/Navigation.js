import { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard,
  AccountBalance,
  Timeline,
  Settings,
  Person,
} from "@mui/icons-material";
import Link from "next/link";
import { usePathname } from "next/navigation";

const pages = [
  { name: "Dashboard", href: "/dashboard", icon: <Dashboard /> },
  { name: "Transactions", href: "/transactions", icon: <AccountBalance /> },
  { name: "Analytics", href: "/analytics", icon: <Timeline /> },
];

const settings = ["Profile", "Account", "Settings", "Logout"];

export default function Navigation() {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const pathname = usePathname();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2, display: { xs: "flex", md: "none" } }}
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h6"
              noWrap
              component={Link}
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontWeight: 700,
                color: "text.primary",
                textDecoration: "none",
                letterSpacing: ".1rem",
              }}
            >
              Financial Planner
            </Typography>

            <Box
              sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, ml: 4 }}
            >
              {pages.map((page) => (
                <Button
                  key={page.name}
                  component={Link}
                  href={page.href}
                  sx={{
                    my: 2,
                    mx: 1,
                    color: pathname === page.href ? "white" : "text.primary",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    borderRadius: "20px",
                    padding: "8px 16px",
                    backgroundColor:
                      pathname === page.href ? "text.primary" : "transparent",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      backgroundColor:
                        pathname === page.href
                          ? "text.primary"
                          : "rgba(16, 185, 129, 0.1)",
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  {page.icon}
                  {page.name}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar sx={{ bgcolor: "secondary.main" }}>
                    <Person />
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => setDrawerOpen(false)}
        >
          <List>
            {pages.map((page) => (
              <ListItem
                key={page.name}
                component={Link}
                href={page.href}
                sx={{
                  backgroundColor:
                    pathname === page.href ? "action.selected" : "transparent",
                }}
              >
                <ListItemIcon
                  sx={{
                    color: pathname === page.href ? "primary.main" : "inherit",
                  }}
                >
                  {page.icon}
                </ListItemIcon>
                <ListItemText
                  primary={page.name}
                  sx={{
                    color: pathname === page.href ? "primary.main" : "inherit",
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
