import type { ProColumns } from '@ant-design/pro-components';
import { useCallback, useMemo } from 'react';
import ProCrudPage from '@/shared/ui/crud/ProCrudPage';
import { fetchUsers, removeUser } from '@/features/users/api/userApi';
import type { User } from '@/features/users/types/userTypes';
import { tCommon } from '@/shared/i18n/helpers';
import { handleApiError } from '@/shared/ui/errors/handleApiError';

const UserListPage = (): JSX.Element => {
  const columns = useMemo<ProColumns<User>[]>(
    () => [
      {
        title: tCommon('table.name'),
        dataIndex: 'Name',
        valueType: 'text'
      },
      {
        title: tCommon('table.email'),
        dataIndex: 'Email',
        valueType: 'text'
      },
      {
        title: tCommon('table.role'),
        dataIndex: 'Role',
        valueType: 'text'
      }
    ],
    []
  );

  const handleFetch = useCallback(async (params: Record<string, unknown>) => {
    return fetchUsers(params);
  }, []);

  const handleRemove = useCallback(async (id: string) => {
    try {
      await removeUser(id);
    } catch (error) {
      handleApiError(error);
    }
  }, []);

  return <ProCrudPage<User> title={tCommon('users')} columns={columns} fetch={handleFetch} onRemove={handleRemove} />;
};

export default UserListPage;
