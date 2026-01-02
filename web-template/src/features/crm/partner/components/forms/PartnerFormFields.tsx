// src/pages/Partner/PartnerFormFields.tsx

import { Form, Input, Select, Switch, Row, Col } from "antd";
import type { FC } from "react";
import { tPartner } from "@/shared/i18n/helpers";
import { RemoteCompanySelect } from "@/shared/ui/select/RemoteCompanySelect";

interface PartnerFormFieldsProps {
  disabled?: boolean;
  show?: {
    name?: boolean;
    type?: boolean;
    isCustomer?: boolean;
    isSupplier?: boolean;
    companyId?: boolean;
    parentPartnerId?: boolean;
    email?: boolean;
    phone?: boolean;
    address?: boolean;
  };
}

const PartnerFormFields: FC<PartnerFormFieldsProps> = ({
  disabled = false,
  show = {
    name: true,
    type: true,
    isCustomer: true,
    isSupplier: true,
    companyId: true,
    parentPartnerId: true,
    email: true,
    phone: true,
    address: true,
  },
}) => {
  return (
    <>
      {show.name && (
        <Form.Item
          label={tPartner("fields.name.label")}
          name="name"
          rules={[
            { required: true, message: tPartner("fields.name.required") },
          ]}
        >
          <Input
            placeholder={tPartner("fields.name.placeholder")}
            disabled={disabled}
          />
        </Form.Item>
      )}

      {show.type && (
        <Form.Item
          label={tPartner("fields.type.label")}
          name="type"
          rules={[
            { required: true, message: tPartner("fields.type.required") },
          ]}
        >
          <Select
            placeholder={tPartner("fields.type.placeholder")}
            disabled={disabled}
            options={[
              {
                label: tPartner("fields.type.individual"),
                value: "Individual",
              },
              { label: tPartner("fields.type.company"), value: "Company" },
            ]}
          />
        </Form.Item>
      )}

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="isCustomer"
            label={tPartner("fields.isCustomer.label")}
            valuePropName="checked"
          >
            <Switch disabled={disabled} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="isSupplier"
            label={tPartner("fields.isSupplier.label")}
            valuePropName="checked"
          >
            <Switch disabled={disabled} />
          </Form.Item>
        </Col>
      </Row>

      {show.companyId && (
        <RemoteCompanySelect
          name="companyId"
          label={tPartner("fields.companyId.label")}
          placeholder={tPartner("fields.companyId.placeholder")}
          disabled={disabled}
        />
      )}

      {show.parentPartnerId && (
        <Form.Item
          label={tPartner("fields.parentPartnerId.label")}
          name="parentPartnerId"
        >
          <Input
            placeholder={tPartner("fields.parentPartnerId.placeholder")}
            disabled={disabled}
          />
        </Form.Item>
      )}

      {show.email && (
        <Form.Item label={tPartner("fields.email.label")} name="email">
          <Input
            placeholder={tPartner("fields.email.placeholder")}
            disabled={disabled}
          />
        </Form.Item>
      )}

      {show.phone && (
        <Form.Item label={tPartner("fields.phone.label")} name="phone">
          <Input
            placeholder={tPartner("fields.phone.placeholder")}
            disabled={disabled}
          />
        </Form.Item>
      )}

      {show.address && (
        <Form.Item label={tPartner("fields.address.label")} name="address">
          <Input
            placeholder={tPartner("fields.address.placeholder")}
            disabled={disabled}
          />
        </Form.Item>
      )}
    </>
  );
};

export default PartnerFormFields;
