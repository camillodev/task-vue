const DescriptionService = {
  saveDescription(description) {
    localStorage.setItem('description', JSON.stringify(description));
  },
};

export default DescriptionService;
