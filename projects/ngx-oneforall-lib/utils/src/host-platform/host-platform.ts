import { HostPlatform } from "@ngx-oneforall/constants";

export function getHostPlatform(): HostPlatform {
    const ua = navigator.userAgent || navigator.vendor;

    if (/windows phone/i.test(ua)) return HostPlatform.WINDOWS_PHONE;
    if (/win/i.test(ua)) return HostPlatform.WINDOWS;
    if (/android/i.test(ua)) return HostPlatform.ANDROID;
    if (/iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && 'ontouchend' in document))
        return HostPlatform.IOS;
    if (/mac/i.test(ua)) return HostPlatform.MAC;
    if (/linux/i.test(ua)) return HostPlatform.LINUX;

    return HostPlatform.UNKNOWN;
}
