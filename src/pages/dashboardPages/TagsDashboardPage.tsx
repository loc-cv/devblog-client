import { Modal } from 'components/Modal';
import { TagForm } from 'features/tags/components/TagForm';
import { TagsTable } from 'features/tags/components/TagsTable';
import { Fragment, useState } from 'react';

export const TagsDashboardPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Fragment>
      <button type="button" onClick={() => setIsModalOpen(true)}>
        Create new tag
      </button>

      <Modal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        title="Create new tag"
      >
        <TagForm />
      </Modal>

      <TagsTable />
    </Fragment>
  );
};
