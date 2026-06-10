import ctypes, sys

def exclude(hwnd: int) -> bool:
    return bool(ctypes.windll.user32.SetWindowDisplayAffinity(ctypes.c_int(hwnd), 0x00000011))

def include(hwnd: int) -> bool:
    return bool(ctypes.windll.user32.SetWindowDisplayAffinity(ctypes.c_int(hwnd), 0x00000000))

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: capture_protection.py <exclude|include> <hwnd>"); sys.exit(1)
    action, hwnd_str = sys.argv[1], sys.argv[2]
    try:
        hwnd = int(hwnd_str)
    except ValueError:
        print(f"Invalid HWND: {hwnd_str}"); sys.exit(1)
    success = exclude(hwnd) if action == "exclude" else include(hwnd)
    print(f"{action}:{success}")
    sys.exit(0 if success else 1)
