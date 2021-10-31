export interface Device {
    id: number;
    manageIp: string;
    managePwd: string;
    manageUsername: string;
    model: string;
    name: string;
    hardwareVersion?: string;
    softwareVersion?: string;
    type?: string;
    vendor: string;
    version: string;
}

export interface DeviceModel {
    confModel?: string;
    index: number;
    name: string;
    schema: JSON;
}
